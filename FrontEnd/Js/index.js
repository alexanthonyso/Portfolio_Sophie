const token = sessionStorage.getItem("token")
const gallery = document.querySelector(".gallery")

//On crée l’élément "figure" dans la galerie
const createFigureGallery = (element) => {
    const figure = document.createElement("figure")

    figure.setAttribute("data-tag", element.category.name)
    figure.setAttribute("data-id", element.id)

    // On crée l’élément img.
    const img = document.createElement("img")
    img.setAttribute("crossorigin", "anonymous")
    img.setAttribute("src", element.imageUrl)
    img.setAttribute("alt", element.title)

    const figcaption = document.createElement("figcaption")
    figcaption.innerText = element.title

    // On rattache l’image & figcaption à figure

    figure.appendChild(img)
    figure.appendChild(figcaption)

    // On rattache figure a la gallery

    gallery.appendChild(figure)
}

fetch("http://localhost:5678/api/works")
    // On récupère les données au format JSON
    .then((res) => {
        if (res.ok) {
            return res.json()
        }
    })

    .then((products) => {
        products.forEach((product) => {
            createFigureGallery(product)
        })
    })

// Étape 1.2 : Réalisation du filtre des travaux

const createButton = (button) => {
    const filtres = document.querySelector("#filtres")

    filtres.insertAdjacentHTML("beforeend", `<button data-tag="${button.name}"> ${button.name} </button>`)
}

fetch("http://localhost:5678/api/categories")
    .then((res) => {
        if (res.ok) {
            return res.json()
        }
    })

    .then((data) => {
        data.forEach((button) => {
            createButton(button)
        })
    })

    .then(() => {
        const buttons = document.querySelectorAll("#filtres button")

        buttons.forEach((button) => {
            button.addEventListener("click", function () {
                buttons.forEach((element) => element.classList.remove("active"))

                this.classList.add("active")

                const buttonTag = this.dataset.tag

                const images = document.querySelectorAll(".gallery figure")

                images.forEach((image) => {
                    if (image.getAttribute("data-tag") === buttonTag) {
                        image.classList.remove("filtered")
                    } else {
                        image.classList.add("filtered")
                    }
                })
            })
        })

        function viewallPictures() {
            const allPictures = document.querySelectorAll(".gallery figure")

            allPictures.forEach((image) => {
                image.classList.remove("filtered")
            })
        }

        boutonTous.addEventListener("click", viewallPictures)
    })

const boutonTous = document.querySelector('button[data-tag="Tous"]')
boutonTous.classList.add("active")

// ETAPE LOGIN LOGOUT AFFICHER BARRE EN MODE ADMIN + LOGIN LOGOUT

const logout = () => {
    //TOKEN
    sessionStorage.removeItem("token")
    window.location.href = "/FrontEnd/login.html"
}

const modifierContent = () => {
    //BARRE BLACK TOP

    // AJOUT BOUTON MODIFIER
    //RECOVERY BODY
    const body = document.querySelector("#body")
    //RECOVERY ARTICLE
    const article = document.querySelector("article")
    //RECOVERY IMG
    const imgmodif = document.querySelector("#imgmodif")
    //RECOVERY GALLERY
    const projetsTitle = document.querySelector("#mesProjets")

    body.insertAdjacentHTML(
        "afterbegin",
        `<div id="editionBarre">
  <span class="edition">
    <i class="fa-regular fa-pen-to-square"></i> Mode édition
  </span>
  <button id="buttonChangement">publier les changements</button>
</div>`
    )

    // ADD MODIF TEXT

    article.insertAdjacentHTML(
        "afterbegin",
        `<a href="#" class="modifier">
<i class="fa-regular fa-pen-to-square"></i> modifier
</a>`
    )

    imgmodif.insertAdjacentHTML(
        "afterend",
        `<a href="#" class="modifier modifierFigure">
<i class="fa-regular fa-pen-to-square"></i> modifier
</a>`
    )

    projetsTitle.insertAdjacentHTML(
        "afterend",
        `<a id="openModal" href="#modal" class="modifier modifierFigure">
<i class="fa-regular fa-pen-to-square"></i> modifier
</a>`
    )

    // ON MASQUE LES FILTRES
    document.getElementById("filtres").style.display = "none"

    // -----------------------------------------------------
    //OPEN MODAL
    document.getElementById("openModal").addEventListener("click", (event) => {
        // event.preventDefault()
        modalOpen(event)
    })

    //LOGIN NAV
    document.getElementById("loginButton").innerHTML = `<a id="logoutButton">logout</a>` //on remplace login par logout

    //LOGOUT
    const logoutButton = document.getElementById("logoutButton")

    logoutButton.addEventListener("click", () => {
        logout()
    })
}

//

if (token !== null) {
    modifierContent()
}

// MODAL

function modalOpen(event) {
    event.preventDefault()
    const modal = `
          <aside id="modal">
              <div class="modalWrapper">
                  <i class="fa-solid fa-arrow-left" id="backToModal"></i>
                  <i id="closeModal" class="fa-solid fa-xmark" ></i>
                  <h2 id="galleryTitle">Galerie photo</h2>
                  <div id="modalGallery"></div>
                  <form action="#" method="post" id="addPhotoForm">
                      <div id="sendPhotoContainer">
                          <label class="sendPhotoContent" for="buttonAddPhoto">
                              <i class="fa-regular fa-image photoIcon"></i>
                          </label>
                          <label for="buttonAddPhoto" id="buttonAddPhotoData" class="sendPhotoContent">
                            + Ajouter photo
                          <input type="file" id="buttonAddPhoto" accept="image/jpeg,image/png,image/jpg" required />
                          </label>
                          <label class="sendPhotoContent" id="indicationPhoto">jpg.png: 4mo max</label>
                          <img id="photoShowPreview" alt="votre photo" src="#" />
                      </div>
                      <label>Titre</label>
                      <input type="text" name="Title" id="sendPhotoTitle" required />
                      <label>Catégorie</label>
                      <select id="sendPhotoCategory">
                          <option value="0"></option>
                          <option value="1">Objets</option>
                          <option value="2">Appartements</option>
                          <option value="3">Hôtels & restaurants</option>
                      </select>
                  </form>
                  <span></span>
                  <button id="addPhoto">Ajouter une photo</button>
                  <button id="valider">Valider</button>
                  <a href="#" id="deleteGallery">Supprimer la galerie</a>
              </div>
          </aside>
      `
    document.body.insertAdjacentHTML("afterbegin", modal)

    //VERIF CHANGE IN FORM
    document.getElementById("addPhotoForm").addEventListener("change", verifyData)

    document.getElementById("valider").addEventListener("click", () => {
        if (verifyData) {
            createNewWork()
            closeModal()
            
        }
    })

    //RESTORE CLOSED MODALE
    document.getElementById("closeModal").addEventListener("click", closeModal)

    //RESTORE BUTTON ADD IMG  CLICK ADD IMG
    document.getElementById("addPhoto").addEventListener("click", ajoutPhotoMode)
    document.getElementById("modal").addEventListener("click", (event) => {
        if (event.target === document.getElementById("modal")) {
            closeModal()
        }
    })

    const photoPreview = document.getElementById("buttonAddPhoto")
    photoPreview.addEventListener("change", (event) => {
        // event.preventDefault()
        const file = event.target.files[0]
        if (file.size < 4 * 1024 * 1024) {
            //VERIFICATION IMAGE SIZE
            const photoPreviewBox = document.getElementById("photoShowPreview")
            const fileUrl = URL.createObjectURL(file)
            photoPreviewBox.src = fileUrl

            const sendPhotoContentElements = document.querySelectorAll(".sendPhotoContent")
            for (const element of sendPhotoContentElements) {
                element.style.display = "none"
                photoPreviewBox.style.display = "block"
            }
        } else {
            alert("image trop volumineuse")
        }
    })

    //CREATION  ELEMENT FIGURE GALERIE  MODALE
    const createFigureModal = (element) => {
        const modalGallery = document.getElementById("modalGallery")

        const figure = document.createElement("figure")
        figure.setAttribute("data-id", element.id)
        figure.setAttribute("data-tag", element.category.name)
        figure.setAttribute("class", "figureModalGallery")

        const img = document.createElement("img")
        img.setAttribute("class", "imgModalGallery")
        img.setAttribute("crossorigin", "anonymous")
        img.setAttribute("src", element.imageUrl)
        img.setAttribute("alt", element.title)

        const arrowIcon = document.createElement("i")
        arrowIcon.setAttribute("class", "fa-solid fa-arrows-up-down-left-right arrowMove")

        const trashIcon = document.createElement("i")
        trashIcon.setAttribute("class", "fa-solid fa-trash-can trashCan")
        trashIcon.setAttribute("data-id", element.id)

        const h4 = document.createElement("h4")
        h4.innerText = "éditer"

        figure.appendChild(img)
        figure.appendChild(arrowIcon)
        figure.appendChild(trashIcon)
        figure.appendChild(h4)

        modalGallery.appendChild(figure)

        del(trashIcon, element.id)
    }

    let products = []
    // FETCH
    const f = async () => {
        await fetch("http://localhost:5678/api/works")
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then((data) => {
                products.push(data)
            })
            //LOG ERROR
            .catch((err) => {
                console.log(err)
            })
    }

    const createM = async () => {
        await f()
        console.log(products[0])
        if (products) {
            products[0].forEach((product) => {
                createFigureModal(product) 
            })
        }
    }
    createM()
}

const del = (trashIcon, id) => {
    //listen trash icon > click => remove all element with data-id
    trashIcon.addEventListener("click", (event) => {
        const selectDataId = document.querySelectorAll(`[data-id="${id}"]`)
        selectDataId.forEach((el) => {
            el.remove()
        })

        //delete in api
        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage["token"]}`,
            },
        })
            .then((res) => {
                if (res.ok) {
                    console.log("L'image à bien été supprimée")
                } else {
                    //DISPLAY ERROR MSG
                    console.error("Une erreur est survenue lors de la suppression")
                }
            })
            .catch((err) => {
                console.error(err)
            })
    })
}

const closeModal = () => {
    document.getElementById("modal").remove()
}



const ajoutPhotoMode = () => {
    changeModalContent()
}

const changeModalContent = () => {
    document.getElementById("addPhotoForm").style.display = "flex"
    document.getElementById("modalGallery").style.display = "none"
    document.getElementById("addPhoto").style.display = "none"
    document.getElementById("valider").style.display = "block"
    document.getElementById("galleryTitle").innerHTML = "Ajout photo"
    document.getElementById("deleteGallery").style.display = "none"
    document.getElementById("backToModal").style.display = "block"
    document.getElementById("backToModal").addEventListener("click", backToModal)
}

const backToModal = () => {
    document.getElementById("addPhotoForm").style.display = "none"
    document.getElementById("modalGallery").style.display = "grid"
    document.getElementById("addPhoto").style.display = "block"
    document.getElementById("valider").style.display = "none"
    document.getElementById("galleryTitle").innerHTML = "Galerie photo"
    document.getElementById("deleteGallery").style.display = "block"
    document.getElementById("backToModal").style.display = "none"
}

//VERIF SI LES DATAS DANS LE FORMULAIRE SONT OK
const verifyData = () => {
    const buttonCheck = document.getElementById("valider")
    const newPhoto = document.getElementById("buttonAddPhoto")
    const newTitle = document.getElementById("sendPhotoTitle")
    const selectElement = document.getElementById("sendPhotoCategory")
    //ALL IS OK CHANGE BACKGROUND COLOR
    if (newPhoto.value !== "" && newTitle.value !== "" && selectElement.value !== "0") {
        let error = document.querySelector("p#error")
        if (error) {
            error.remove()
        }
        buttonCheck.style.backgroundColor = "#1D6154"
        return true
        // IS NOT OK COLOR GREY
    } else {
        buttonCheck.style.backgroundColor = "#A7A7A7"
        return false
    }
}

const createNewWork = () => {
    //CREATION DE LA NOUVELLE IMAGE
    const data = new FormData()
    const buttonCheck = document.getElementById("valider")
    const newPhoto = document.getElementById("buttonAddPhoto")
    const newTitle = document.getElementById("sendPhotoTitle")
    const newCategory = document.getElementById("sendPhotoCategory")
    data.append("image", newPhoto.files[0])
    data.append("title", newTitle.value)
    data.append("category", newCategory.value)

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        accept: "application/json",
        headers: {
            Authorization: `Bearer ${sessionStorage["token"]}`,
        },
        body: data,
    })
        .then((res) => {
            if (res.ok) {
                addDynamicWork()
                alert("Projet ajouté !")
            } else {
                let error = document.querySelector("p#error")
                if (error) {
                    error.parentNode.removeChild(error)
                }
                buttonCheck.insertAdjacentHTML("beforebegin", `<p id="error">*Veuillez remplir tous les champs</p>`)
            }
        })
        .then((data) => {
            console.log(data)
        })

        .catch((error) => {
            console.log(error)
        })
}

const addDynamicWork = () => {
    fetch("http://localhost:5678/api/works")
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
        })
        .then((products) => {
            createFigureGallery(products[products.length - 1])
            console.log("L'image a bien été ajoutée")
        })
}

// --------------------------------------------------------------------------------------
