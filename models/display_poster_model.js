class DisplayPosterModel{
    constructor(category, title, image, isFavoured, colorPalette) {
        this._category = category;
        this._title = title;
        this._image = image;
        this._isFavoured = isFavoured;
        this._colorPalette = colorPalette;
    }


    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    get isFavoured() {
        return this._isFavoured;
    }

    set isFavoured(value) {
        this._isFavoured = value;
    }

    get colorPalette() {
        return this._colorPalette;
    }

    set colorPalette(value) {
        this._colorPalette = value;
    }

    printData() {
        print(this._category)
        print(this._title)
    }
}