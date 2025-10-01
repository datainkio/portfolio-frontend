/**
 * Purpose:
 * This script processes each record in the "Images" table, retrieves the image file from the "File" attachment field,
 * extracts its height, width, file type, and file size (excluding SVG files), and updates the corresponding fields
 * "height", "width", "type", and "filesize" with the extracted values.
 *
 * Steps:
 * 1. Access the "Images" table.
 * 2. Fetch all records.
 * 3. Iterate through each record:
 *    a. Get the first attachment in the "File" field.
 *    b. If an attachment exists, retrieve its URL.
 *    c. Determine if the file is an SVG.
 *       - If SVG, update only the "type" field.
 *       - If not SVG, proceed to fetch and extract details.
 *    d. Fetch the image as a Blob.
 *    e. Create an ImageBitmap to extract dimensions.
 *    f. Determine the file type from the MIME type.
 *    g. Extract file size and format it.
 *    h. Prepare the update for the record.
 * 4. Batch updates in groups of 50 to comply with Airtable's API limits.
 * 5. Execute the updates.
 *
 * TODO: Update to handle SVG files differently, e.g., store dimensions as null.
 * TODO: Update to ignore files that have already been processed.
 * TODO: Better error handling and logging.
 */

// Define table and field names
const tableName = "Images"; // Table name
const attachmentFieldName = "File"; // Attachment field name
const heightFieldName = "height"; // Field to store image height
const widthFieldName = "width"; // Field to store image width
const typeFieldName = "type"; // Field to store image type
const filesizeFieldName = "filesize"; // Field to store image file size

// Access the table
const table = base.getTable(tableName);

// Fetch all records from the table, fetching only necessary fields to optimize performance
let records = await table.selectRecordsAsync({
  fields: [
    attachmentFieldName,
    heightFieldName,
    widthFieldName,
    typeFieldName,
    filesizeFieldName,
  ],
});

// Prepare an array to hold updates
let updates = [];

// Function to format bytes into human-readable format
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  return size;
}

// Iterate through each record
for (let record of records.records) {
  // Get the attachments from the "File" field
  let attachments = record.getCellValue(attachmentFieldName);

  if (attachments && attachments.length > 0) {
    // Take the first attachment
    let attachment = attachments[0];
    let url = attachment.url;
    let filename = attachment.filename;
    let mimeType = attachment.type;
    let fileSize = attachment.size; // Size in bytes

    // Check if the file is an SVG
    if (mimeType === "image/svg+xml") {
      // Update only the "type" field to "SVG" and optionally clear other fields
      updates.push({
        id: record.id,
        fields: {
          [typeFieldName]: "SVG",
          [heightFieldName]: null,
          [widthFieldName]: null,
          [filesizeFieldName]: null,
        },
      });
      continue; // Skip further processing for SVG files
    }

    try {
      // Fetch the image as a Blob
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }
      let blob = await response.blob();

      // Create an ImageBitmap from the Blob to extract dimensions
      let imageBitmap = await createImageBitmap(blob);

      // Extract width and height
      let width = imageBitmap.width;
      let height = imageBitmap.height;

      // Determine file type from MIME type (e.g., 'image/png' => 'PNG')
      let fileType = mimeType.split("/")[1].toUpperCase();

      // Format file size into a human-readable format
      let formattedSize = formatBytes(fileSize);

      // Prepare the update fields
      let updateFields = {
        [heightFieldName]: height,
        [widthFieldName]: width,
        [typeFieldName]: fileType,
        [filesizeFieldName]: formattedSize,
      };

      // Add to updates array
      updates.push({
        id: record.id,
        fields: updateFields,
      });
    } catch (error) {
      console.error(`Error processing record ${record.id}: ${error}`);
      // Optionally, update the "type" and "filesize" fields with the error message or set height and width to null
      updates.push({
        id: record.id,
        fields: {
          [heightFieldName]: null,
          [widthFieldName]: null,
          [typeFieldName]: `Error: ${error.message}`,
          [filesizeFieldName]: `Error: ${error.message}`,
        },
      });
    }
  } else {
    // No attachment found, optionally clear the fields or set to null
    updates.push({
      id: record.id,
      fields: {
        [heightFieldName]: null,
        [widthFieldName]: null,
        [typeFieldName]: "No file attached",
        [filesizeFieldName]: "No file attached",
      },
    });
  }

  // Batch updates in groups of 50 to comply with Airtable's API limits
  if (updates.length === 50) {
    await table.updateRecordsAsync(updates);
    updates = []; // Reset the updates array after processing
  }
}

// Update any remaining records (fewer than 50)
if (updates.length > 0) {
  await table.updateRecordsAsync(updates);
}

// Confirmation message
output.text("All image records have been processed and updated accordingly.");
