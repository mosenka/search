
const icon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z"/><path d="M7 18.25a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46a.25.25 0 01-.397-.2v-5.01z"/></svg>'


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const list = document.getElementById('list');

    form.addEventListener('submit', handlerSubmit);

    form.search.addEventListener('input', function (even) {
        resetInputError(this);
    })

    function handlerSubmit(event) {
        event.preventDefault();

        if(!validateInput(this.search)) {
            showError(this.search, 'Не верные параметры поиска');
            return;
        }

        searchInGitHub(this.search.value);

    }

    async function searchInGitHub(str) {

        const searchParams = encodeURIComponent(str)

        let response = await fetch( `https://api.github.com/search/repositories?sort=stars&per_page=10&q=${searchParams}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
            },
        })

        try {
            let result = await response.json();
            showSearchResultWrapper();
            list.innerHTML = "";

            if(result.total_count > 0) {
                result.items.forEach(item => {
                    let card = createSearchCard(item);
                    list.append(card)
                })

            } else {
                let message = document.createElement('p')
                message.className = "title";
                message.innerHTML = "Ничего не найдено";

                list.append(message);
            }

        } catch {
            console.log('error')
        }
    }

    function validateInput(input) {
        return input.value.length > 3 && input.value.length < 265;
    }

    function showError(input, textError = 'ошибка') {
        resetInputError(input)

        input.classList.add('is-error');

        let alert = document.createElement('span');
        alert.className = "form__error";
        alert.innerHTML = textError;

        input.after(alert);

    }

    function resetInputError(input) {
        input.classList.remove('is-error');

        let alert = input.parentElement.querySelector('.form__error');

        if(!alert) return;

        alert.remove();
    }

    function createSearchCard(item) {
        let { full_name: title, description, html_url: href, topics } = item;

        const card = document.createElement('div');
        card.className = 'result-item';



        const subtitle = document.createElement('a');
        subtitle.className = 'result-item__subtitle';
        subtitle.innerHTML = title;
        subtitle.href = href;
        subtitle.target = '_blank';

        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'result-item__icon';
        iconWrapper.innerHTML = icon;
        subtitle.prepend(iconWrapper);
        card.append(subtitle);

        const desc = document.createElement('div');
        desc.className = 'result-item__desc';
        desc.innerHTML = description;
        card.append(desc);

        const categories = document.createElement('div');
        categories.className = 'categories';

        topics.forEach( item => {
            let span = document.createElement('span');
            span.className = 'categories__item';
            span.innerHTML = item;
            categories.append(span);
        });
        card.append(categories);

        return card

    }

    function showSearchResultWrapper(){
        const list = document.getElementById('list');
        list.hidden = false;

        const title = document.querySelector('.title');
        title.hidden = false;

    }

})