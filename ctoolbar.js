const placeholders = [];
const questions = [];

const addQuestionBtn = document.querySelector('#addQuestion');
addQuestionBtn.onclick = function () {
     AddQuestion();
};

const addPlaceholderBtn = document.querySelector('#addPlaceholder');
addPlaceholderBtn.onclick = addPlaceholder;

 const placeholdersBlock = document.querySelector('#placeholders');
 const questionsBlock = document.querySelector('#questions');

 function addPlaceholder() {
     const title = prompt('Title', `title-${placeholders.length}`);
     if (!title) return false;

     placeholders.push({
         title: title,
         type: 'string',
         id: Date.now()
     });

     placeholdersBlock.innerHTML = createPlaceholdersTemplate();
 }

 function AddQuestion() {
     questionsBlock.innerHTML = createQuestionsTemplate();
 }

 function createQuestionsTemplate() {
     const t = tmpl(`
         {% for (let i=0; i<o.length; i++) { %}
               <li>{%=o[i]%}</li>
         {% } %}
     `);

     return t(questions);
 }

 function createPlaceholdersTemplate() {
     const t = tmpl(`
         {% for (let i=0; i < o.length; i++) { %}
               <li style="margin-bottom: 10px">
                 <button class="empty" onclick="InsertPlaceHolder({%= o[i].id %})">
                    {%= o[i].title %}
                 </button>
               </li>
         {% } %}
     `);

     return t(placeholders);
 }

function InsertPlaceHolder (event) {
    const placeholder = placeholders.find(p => p.id === event);
    CKeditor.execute( 'placeholder', { value: placeholder.title } );
}
