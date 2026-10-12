// SELECTING ELEMENTS

const input = document.getElementById("content")
const submitBtn = document.getElementById("submit")
const section = document.getElementById("container")
const form = document.getElementById("form")
const plusIcon = document.getElementById("plus")

const PLUS_ICON = '<i class="fa-solid fa-plus"></i>'
const SAVE_ICON = '<i class="fa-solid fa-check"></i>'

function toggleForm() {
    form.classList.add('show')
    plusIcon.style.display = 'none'
}

let editingTask = null;

function addTask(e) {
    // Prevent default behaviour
    e.preventDefault()

    // Get the input value
    // ORIGINAL: const formInput = input.value
    // FIX: trim() so a task can't be just spaces
    const formInput = input.value.trim()

    // To prevent submit if input is empty
    if (formInput === '') return;


    if (editingTask) {
        // If we're editing an existing task, update its text instead of creating a new one
        editingTask.querySelector('p').textContent = formInput;

        // FIX: after saving an edit, drop edit mode and restore the button to "Add" state
        editingTask = null;

        // ORIGINAL: submitBtn.textContent = 'Add';
        // FIX: textContent wiped out the <i> FontAwesome icon forever;
        // restore the icon HTML instead
        submitBtn.innerHTML = PLUS_ICON
    } else {
        // Creating elements
        const div = document.createElement('div')
        const para = document.createElement('p')
        const paraTwo = document.createElement('p')
        const span = document.createElement('span')
        const spanTwo = document.createElement('span')
        const checkBox = document.createElement('input')

        // ORIGINAL: para.innerHTML = formInput
        // FIX: innerHTML with user input is an XSS hole — textContent is safe
        para.textContent = formInput

        paraTwo.appendChild(span)
        paraTwo.appendChild(spanTwo)

        checkBox.type = 'checkbox'

        span.innerHTML = '<i class="fa-solid fa-trash"></i>'
        spanTwo.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'

        span.classList.add('delete-btn')
        spanTwo.classList.add('edit-btn')

        // Adding element(s) to parent element(s)
        div.appendChild(para)
        div.appendChild(paraTwo)
        div.appendChild(checkBox)

        // Adding a class to an element
        para.classList.add('text')
        div.classList.add('task')

        section.appendChild(div)

        // ORIGINAL: input.value = ''  (was here, inside the "new task" branch only)
        // FIX: moved to the end of the function so the field also clears
        // after an EDIT is saved (see end of addTask)

        span.addEventListener('click', function(e){
            const task = e.target.closest('.task')
            task.remove()
            // FIX: if the deleted task was being edited, drop edit mode
            if (task === editingTask) cancelEdit()

        })

        spanTwo.addEventListener('click', function(e) {
            // To get the parent element
            const task = e.target.closest('.task')

            // to get the child element inside a parent element and its content
            const paraText = task.querySelector('.text').textContent
            

            //Adding it to the input

            // FIX: when editing, the input should show the task's text, not the placeholder
            input.value = paraText
            // FIX: track which task is being edited so we can update it on submit
            editingTask = task


            // ORIGINAL: submitBtn.textContent = 'Save'
            // FIX: keep it an icon button (textContent killed the <i> icon)
            submitBtn.innerHTML = SAVE_ICON
            input.focus()
            // task.remove()
        })

        checkBox.addEventListener('change', function () {
            if (this.checked) {
                para.classList.add('done')
            } else {
                // ORIGINAL: paraTwo.classList.remove('done')
                // FIX: wrong element — the 'done' class lives on para,
                // so un-ticking never removed the strikethrough
                para.classList.remove('done')
            }
        })
    }

    // FIX (was missing): clear the field in BOTH branches — after adding AND after editing
    input.value = ''
}

function cancelEdit() {
    editingTask = null
    submitBtn.innerHTML = PLUS_ICON
}

// Add event listeners
plusIcon.addEventListener('click', toggleForm)
// ORIGINAL: submitBtn.addEventListener('click', addTask)
// FIX: listen on the FORM's submit event. A click-only listener means pressing
// Enter in the input bypassed addTask and the form did a real page reload
// (action=""), losing the task. Submit covers both the button click and Enter.
form.addEventListener('submit', addTask)
// FIX (small UX extra): Escape in the input leaves edit mode
input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cancelEdit()
})
