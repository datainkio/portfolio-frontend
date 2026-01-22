/**
 * ---
 * aix:
 *   id: frontend.airtable.scripts.validateprojects
 *   role: Airtable integration module: airtable/scripts/validateProjects.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - airtable
 *     - scripts
 * ---
 */
/**
 * Purpose: The script checks each "Project" record's linked records across multiple tables.
 * If any linked record has "Published" set to false, it sets the "All Published" field
 * in "Projects" to false and lists the unpublished records in the "Unpublished Links" field.
 * Otherwise, it sets "All Published" to true and clears "Unpublished Links".
 *
 * Caching: The script uses caches (publishedStatusCaches) to store the "Published" status
 * of records in linked tables, preventing redundant fetches and optimizing performance.
 */

// Define the primary table and result fields
const primaryTableName = "Projects"; // Primary table name
const resultFieldName = "All Published"; // Checkbox field in the primary table to update
const detailsFieldName = "Unpublished Links"; // Long Text field to store details of unpublished links

// Define an array of linked fields with their corresponding secondary tables and published field names
const linkedFields = [
  {
    fieldName: "Organizations",
    tableName: "Organizations",
    publishedFieldName: "Published",
  },
  { fieldName: "Roles", tableName: "Roles", publishedFieldName: "Published" },
  {
    fieldName: "Activities",
    tableName: "Activities",
    publishedFieldName: "Published",
  },
  {
    fieldName: "Galleries",
    tableName: "Galleries",
    publishedFieldName: "Published",
  },
  {
    fieldName: "Nuggets",
    tableName: "Nuggets",
    publishedFieldName: "Published",
  },
  { fieldName: "Category", tableName: "IA", publishedFieldName: "Published" },
];

// Access the primary table
const primaryTable = base.getTable(primaryTableName);

// Fetch all records from the primary table
let primaryRecords = await primaryTable.selectRecordsAsync();

// Prepare an array to hold updates
let updates = [];

// Initialize caches for each linked table to store Published statuses
let publishedStatusCaches = {};

// Fetch all records from each secondary table and cache them
for (let linked of linkedFields) {
  const secondaryTable = base.getTable(linked.tableName);
  let secondaryRecords = await secondaryTable.selectRecordsAsync({
    fields: [linked.publishedFieldName],
  });
  publishedStatusCaches[linked.tableName] = secondaryRecords;
}

// Define a helper function to process updates in batches of 50
async function processBatch(updatesBatch) {
  try {
    await primaryTable.updateRecordsAsync(updatesBatch);
  } catch (error) {
    console.error("Error updating records:", error);
    output.text(`Error updating records: ${error}`);
  }
}

// Iterate through each record in the primary table
for (let record of primaryRecords.records) {
  let hasUnpublished = false; // Flag to determine if any linked record is unpublished
  let unpublishedDetails = []; // Array to store details of unpublished records

  // Iterate through each linked field
  for (let linked of linkedFields) {
    const linkedRecordIds = record.getCellValue(linked.fieldName);

    // If there are no linked records in this field, continue to the next linked field
    if (!linkedRecordIds || linkedRecordIds.length === 0) {
      continue;
    }

    // Iterate through each linked record in the current field
    for (let link of linkedRecordIds) {
      const linkedId = link.id;

      // Fetch the linked record from the cached secondary records
      const linkedRecord =
        publishedStatusCaches[linked.tableName].getRecord(linkedId);

      // If the linked record doesn't exist, treat it as unpublished
      if (!linkedRecord) {
        hasUnpublished = true;
        unpublishedDetails.push(
          `• [${linked.fieldName}] Record ID ${linkedId} does not exist.`
        );
        continue;
      }

      // Get the Published field value (assumes it's a checkbox or boolean)
      const isPublished =
        linkedRecord.getCellValue(linked.publishedFieldName) === true;

      if (!isPublished) {
        hasUnpublished = true;
        // Retrieve the title of the linked record (assumes the primary field is the title)
        const recordTitle = linkedRecord.name || linkedRecord.id;
        unpublishedDetails.push(`• [${linked.fieldName}] ${recordTitle}`);
      }
    }

    // If any unpublished record is found, continue to gather all unpublished records
  }

  // Determine the value for "All Published"
  const allPublished = !hasUnpublished;

  // Prepare the update object
  let updateFields = {
    [resultFieldName]: allPublished,
  };

  // If there are unpublished records, add details to the update
  if (hasUnpublished) {
    // Join the unpublishedDetails array into a single string separated by new lines
    const detailsText = unpublishedDetails.join("\n");
    updateFields[detailsFieldName] = detailsText;
  } else {
    // If all are published, clear the "Unpublished Links" field
    updateFields[detailsFieldName] = "";
  }

  // Add the update to the updates array
  updates.push({
    id: record.id,
    fields: updateFields,
  });

  // If updates reach 50, process the batch
  if (updates.length === 50) {
    await processBatch(updates);
    updates = []; // Reset the updates array after processing
  }
}

// After the loop, process any remaining updates
if (updates.length > 0) {
  await processBatch(updates);
}

output.text(
  "All records in 'Projects' have been processed and updated accordingly."
);
