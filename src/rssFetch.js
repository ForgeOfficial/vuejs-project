export const parseRssFeed = async (url, loaded, errorMessage) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const xml = await res.text();
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        loaded.value = true;
        return Array.from(doc.querySelectorAll("item")).map(item => {
            let desc = item.querySelector("description")?.textContent || '';
            let imgUrl = null;

            const title = item.querySelector("title")?.textContent || '';
            const link = item.querySelector("link")?.textContent || '';

            if (desc) {
                const descDoc = new DOMParser().parseFromString(desc, "text/html");
                const img = descDoc.querySelector('img');
                if (img) {
                    imgUrl = img.getAttribute('src');
                    img.remove();
                    desc = descDoc.body.innerHTML;
                }
            }

            if (!imgUrl) {
                const enc = item.querySelector("enclosure");
                if (enc) imgUrl = enc.getAttribute('url');
            }

            return { title, link, desc, imgUrl };
        });
    } catch (err) {
        console.error("Error:", err);
        errorMessage.value = `${err.message} (maybe cors issue)`;
        throw err;
    }
}