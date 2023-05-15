var modalWrap = null;
const openModal = document.getElementById('botonModal')
const modal = document.querySelector('.modal')
const closeModal= document.querySelector('.modal__close')

openModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('modal--show')
})

closeModal.addEventListener('click', () => {
    e.preventDefault();
    modal.classList.remove('modal--show')
})
const showModal = () => {
    if (modalWrap !== null) {
        modalWrap.remove();
    }

    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modalFuncion').append(modalWrap);
    var modal = new bootstrap.Modal(modalWrap, document.querySelector('.modal'));
    modal.show();
    console.log(modalWrap)
}

var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})