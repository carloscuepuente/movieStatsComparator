// la configuracion sera un objeto con los elementos bases para montar un autocomplete widget funcional



const createAutocompleteWidget = (confuration) => {
    // rootLocation hace referencia en que elemento del HTML se quiere que empiece el autocomplete
    // debe ser un elemento seleccionado con un query selector

    const { rootLocation, renderOption, onOptionSelect, inputValue, fetchData } = confuration;


    rootLocation.innerHTML = `

        <label for=""><b>Search for</b></label>
        <input class="input" type="text" id="input-movie">
        <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">

            </div>
        </div>

        </div>
        `;

    const input = rootLocation.querySelector(".input"); //para buscar la data que se va pedir a la api
    const dropdown = rootLocation.querySelector(".dropdown"); //para atacharle la clase de is-active segun haya o no resultados
    const resultsContainer = rootLocation.querySelector(".results"); //para mostrar los resultados de la busqueda de la api


    const onInput = async event => {
        const searchFor = event.target.value;
        resultsContainer.innerHTML = ""

        // const movies = await fetchData(searchFor);
        const response = await fetchData(searchFor);
        // movies es un array

        if (response.length === 0) {
            const newOption = document.createElement("a");
            newOption.classList.add("dropdown-item");
            newOption.innerText = `No results found`;
            resultsContainer.appendChild(newOption);
        } else {
            for (let item of response) {
                const newOption = document.createElement("a"); //crear <a> para aprovechar el styling de bulma
                newOption.classList.add("dropdown-item");

                newOption.innerHTML = renderOption(item);
                resultsContainer.appendChild(newOption);

                // eventlistener en la opcion para interactuar con ella
                newOption.addEventListener("click", (event) => {
                    dropdown.classList.toggle("is-active");
                    input.value = inputValue(item);
                    onOptionSelect(item)
                })
            }
        }
        if (searchFor !== "") {
            dropdown.classList.add("is-active")
        }
        if (searchFor === "") {
            dropdown.classList.toggle("is-active")
        }
    }


    input.addEventListener("input", debounce(onInput, 1000));

    document.addEventListener("click", (event) => {
        if (!rootLocation.contains(event.target)) {
            dropdown.classList.remove("is-active")
        }
    })
}