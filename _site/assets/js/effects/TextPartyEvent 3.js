export function TextPartyEvent(type, params = {}) {
    return new CustomEvent(type, {
        detail: {
            ...params // Spreads all key-value pairs from params into detail
        }
    });
};