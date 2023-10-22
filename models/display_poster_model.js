module.exports = class DisplayPosterModel{
    constructor(category, title, image, isFavoured, colorPalette) {
        this.category = category;
        this.title = title;
        this.image = image;
        this.isFavoured = isFavoured;
        this.colorPalette = colorPalette;
    }
}