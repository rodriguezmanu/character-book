class BookCharacter {
    constructor(frame, store) {
        this.frame = frame;
        this.store = store;
    }

    /**
     * Init method
     *
     * @memberof BookCharacter
     */
    init() {
        this.getCharacters();
    }

    /**
     * Get all Characters and sort by name
     *
     * @memberof BookCharacter
     */
    getCharacters() {
        this.cleanPanel($('.list'));

        this.store
            .getCharacters()
            .then(items => {
                const result = _.sortBy(items, 'name');
                this.renderListCharacters(result);
            })
            .catch(err => {
                console.error(err);
            });
    }

    /**
     *  Render view list characters
     *
     * @param {Array} items
     * @memberof BookCharacter
     */
    renderListCharacters(items) {
        $(this.frame).append('<ul class="list"></ul>');

        for (let index = 0; index < items.length; index++) {
            const item = items[index];

            this.frame.find('ul').append(`
                <li class="item" id="${item.id}">
                    <h3 class="name">
                        ${item.name}
                    </h3>
                    <h4 class="species">
                        ${item.species}
                    </h4>
                </li>
            `);
        }

        this.handlerClickCharacter();
    }

    /**
     * Handler click character sidebar
     *
     * @memberof BookCharacter
     */
    handlerClickCharacter() {
        const _this = this;

        $('.item').on('click', function() {
            var id = $(this).attr('id');
            _this.setCharacterDetails(id);
        });
    }

    /**
     * Set character into details section
     *
     * @param {String} id
     * @memberof BookCharacter
     */
    setCharacterDetails(id) {
        this.store
            .getCharacterDetails(Number(id))
            .then(item => {
                this.cleanPanel($('.editor'));
                this.cleanPanel($('.details'));

                this.renderDetailCharacter(item);
            })
            .catch(err => {
                console.error(err);
            });
    }

    /**
     * Render single detail character into detail section
     *
     * @param {Object} item
     * @memberof BookCharacter
     */
    renderDetailCharacter(item) {
        $(this.frame).append('<div class="details"></div>');

        this.frame.find('.details').append(`
            <div>
                <img src="${item.picture}">
                <div>
                    <h2 class="name">${item.name}</h2>
                    <h3 class="species">${item.species}</h3>
                </div>
            </div>
            <p class="description">${item.description}</p>
            <div>
                <button type="button" class="edit">Edit</button>
            </div>
        `);

        this.handlerEdit(item);
    }

    /**
     * Clean panel
     *
     * @param {Object} $el
     * @memberof BookCharacter
     */
    cleanPanel($el) {
        $el.remove();
    }

    /**
     * Handler edit click
     *
     * @param {any} item
     * @memberof BookCharacter
     */
    handlerEdit(item) {
        const _this = this;

        $('.edit').on('click', function() {
            _this.cleanPanel($('.details'));

            $(_this.frame).append('<div class="editor"></div>');

            _this.frame.find('.editor').append(`
                <div>
                    <img src="${item.picture}">
                </div>
                <div>
                    <input type="text" name="name" value="${item.name}"/>
                    <input type="text" name="species" value="${item.species}"/>
                </div>
                <textarea name="description">
                    ${item.description}
                </textarea>
                <div>
                    <button type="button" class="save">Save</button>
                    <button type="button" class="cancel">Cancel</button>
                </div>
            `);

            _this.handlerSave(item);
            _this.handlerCancel(item);
        });
    }

    /**
     * Handler cancel action and return to static detail view
     *
     * @param {Object} item
     * @memberof BookCharacter
     */
    handlerCancel(item) {
        const _this = this;

        $('.cancel').on('click', function() {
            _this.cleanPanel($('.editor'));
            _this.renderDetailCharacter(item);
        });
    }

    /**
     * Handler save view and update chracter
     *
     * @param {Object} item
     * @memberof BookCharacter
     */
    handlerSave(item) {
        const _this = this;

        $('.save').on('click', function() {
            const character = {
                id: Number(item.id),
                picture: item.picture,
                description: $('[name="description"]').val(),
                name: $('[name="name"]').val(),
                species: $('[name="species"]').val()
            };

            _this.store
                .updateCharacter(character)
                .then(data => {
                    _this.getCharacters();
                    _this.cleanPanel($('.editor'));
                    _this.renderDetailCharacter(character);
                })
                .catch(err => {
                    console.error(err);
                });
        });
    }
}
