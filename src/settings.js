export class Settings {
    constructor() {
        this.fluxSaved = this.loadIfExist("fluxSaved");
        this.newsSaved = this.loadIfExist("newsSaved");
    }

    loadIfExist(key) {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key));
        }
        return [];
    }

    hasFlux(flux) {
        return this.fluxSaved.find((rss) => rss.url === flux.url);
    }

    hasNews(newsUrl) {
        return this.newsSaved.find((news) => news.link === newsUrl);
    }

    addFlux(rss) {
        this.fluxSaved.push(rss);
        localStorage.setItem('fluxSaved', JSON.stringify(this.fluxSaved));
    }

    addNews(news, rssFeed) {
        news.rssUrl = rssFeed.url;
        this.newsSaved.push(news);
        localStorage.setItem('newsSaved', JSON.stringify(this.newsSaved));
    }

    removeNews(news) {
        this.newsSaved = this.newsSaved.filter((newsSave) => newsSave.link !== news.link);
        localStorage.setItem('newsSaved', JSON.stringify(this.newsSaved));
    }

    removeFlux(rss) {
        this.fluxSaved = this.fluxSaved.filter((rssSave) => rssSave.url !== rss.url);
        this.newsSaved = this.newsSaved.filter((news) => news.rssUrl !== rss.url);
        localStorage.setItem('fluxSaved', JSON.stringify(this.fluxSaved));
        localStorage.setItem('newsSaved', JSON.stringify(this.newsSaved));
    }
}