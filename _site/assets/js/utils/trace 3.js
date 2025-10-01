/**
 * Display debugging output in a collapsible panel. Handy for developing w/o access to console.
 * See https://stefirosca.netlify.app/blog/7-tips-tricks-to-make-your-console-log-output-stand-out/
*/

(function() {
    const originalConsoleLog = console.log; // Save original console.log
    // const outputDiv = document.getElementById("consoleOutput");

    console.log = function(message) {
        // Call original console.log to still output to console
        originalConsoleLog.apply(console, arguments);

        // Create a new list item for each log entry
        const newMessage = document.createElement("li");
        if (message instanceof Error) {
            newMessage.innerHTML = "<span style='border-radius: 0; color: red;'>" + message + "</span>";
        } else {
            newMessage.innerHTML = message;
        }
       

        // Append the new message to the div
        VIEW.appendChild(newMessage);
    };
})();

    const VIEW = getView();

    export function trace(obj) {          
            let message;
            let type;
            switch (typeof obj) {
                case 'string':
                type = "🔠";
                message = `${obj}`;
                break;
            case 'number':
                type = "🔢";
                message = `${obj} (isNaN: ${isNaN(obj)})`;
                break;
            case 'boolean':
                type = "☑️";
                message = `${obj}`;
                break;
            case 'object':
                if (obj === null) {
                    type = '\u2796'
                    message = 'The object is null';
                } else if (Array.isArray(obj)) {
                    type = `📘 (len: ${obj.length})`;
                    message = `[${obj}]`;
                } else if (obj instanceof HTMLElement) {
                    type = "🧱";
                    const id = obj.id ? `#${obj.id}` : '(no id)';
                    const classList = obj.classList.length > 0 ? `.${[...obj.classList].join('.')}` : '(no classes)';
                    message = `<${obj.tagName.toLowerCase()}> id: ${id}, classes: ${classList}`;
                } else if (obj instanceof Error) {
                    type = "\u26A0";
                    message = `${obj.name} (message: "${obj.message}", stack: "${obj.stack.split('\n')[0]}")`;
                } else {
                    type = "obj";
                    const keys = Object.keys(obj);
                    message = `${JSON.stringify(obj)} (keys: ${keys.length > 0 ? keys.join(', ') : 'no keys'})`;
                }
                break;
            case 'function':
                type = "function";
                message = `${obj.name || '(anonymous function)'}`;
                break;
            case 'undefined':
                type = "";
                message = '';
                break;
            default:
                type = "";
                message = '';
        }
        updateView(message, type);
    }

    function getView() {
        if (document.getElementById("trace-content")) {
            return document.getElementById("trace-content");
        } else {
            return createView();
        }
    }

    function updateView(message, type) {

        const listItem = document.createElement('li');
        const typeMsg = document.createElement('span');
        const msg = document.createElement('span');

        typeMsg.innerHTML = type + ": ";
        msg.innerHTML = message;
        VIEW.appendChild(listItem);

        listItem.appendChild(typeMsg);
        listItem.appendChild(msg);

        typeMsg.classList.add("inline", "p-0", "basis-1/12", "text-neutral-500");
        msg.classList.add("inline", "p-0", "text-wrap");
        listItem.classList.add("flex", "flex-row", "py-2", "border-b", "border-neutral-400");

        console.log(message);
    }

    function createView() {
        const drawer = document.createElement('div');
        drawer.id = "trace";
        drawer.classList.add("drawer", "z-100");
        
        const toggle = document.createElement('input');
        toggle.id = "trace-view";
        toggle.type = "checkbox";
        toggle.className = "drawer-toggle";

        const drawerContent = document.createElement("div");
        drawerContent.classList.add("drawer-content", "flex", "flex-col", "items-center", "justify-center");

        const button = document.createElement("label");
        button.id = "trace-button";
        button.htmlFor = "trace-view";
        button.classList.add("btn", "btn-sm", "btn-primary", "fixed", "top-0", "left-0");
        button.textContent = "debug";

        const drawerSide = document.createElement("div");
        drawerSide.className = "drawer-side";

        const drawerOverlay = document.createElement("label");
        drawerOverlay.htmlFor = "trace-view";
        drawerOverlay.setAttribute("aria-label", "close sidebar");
        drawerOverlay.className = "drawer-overlay";

        const output = document.createElement("ul");
        output.id = "trace-content";
        output.classList.add("menu", "border-t-accent-400", "border-t-4", "bg-base-200", "text-base-content", "text-xs", "min-h-full", "w-80", "p-4", "pt-16");

        document.body.appendChild(drawer);
        drawer.appendChild(toggle);
        drawer.appendChild(drawerContent);
        drawerContent.appendChild(button);
        drawer.appendChild(drawerSide);
        drawerSide.appendChild(drawerOverlay);
        drawerSide.appendChild(output);

        return output;
    }