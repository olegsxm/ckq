import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import QuestionBox from "./questionbox/questionbox";

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        // extraPlugins: [ ConvertDivAttributes ],
        plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic, QuestionBox],
        toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList', 'QuestionBox' ],
    } )
    .then( editor => {
        AddQuestionBoxListiners();
    } )
    .catch( error => {
        console.error( error.stack );
    });


    function AddQuestionBoxListiners() {
        document.body.addEventListener('click', function(event) {
            if (event.target.className.includes('question-box__arrow')) {
                const arrow = event.target;
                const parent = arrow.parentNode.parentNode;
                const ansContent = parent.querySelectorAll('.question-box__answer');
                const ansQ = parent.querySelectorAll('.question-box__header__answer')
                const currentHeaderAnswer = parent.querySelector('.question-box__header__answer[data-hidden="false"]'); 
                const currentIndex = getNodeIndex(currentHeaderAnswer);

                const targetIndex = arrow.className.includes('question-box__arrow--left')
                    ? currentIndex - 1 > 0 ? currentIndex - 1 : 0
                    : currentIndex + 1 < ansQ.length ? currentIndex + 1 : currentIndex;
                 
                if (targetIndex === currentIndex) {
                    return false;
                }

                ansQ.forEach((element, index) => {
                    if (index ===  targetIndex) {
                        element.dataset.hidden = "false";
                        ansContent[index].dataset.hidden = "false";
                    } else {
                        element.dataset.hidden = "true";
                        ansContent[index].dataset.hidden = "true"; 
                    }
                });
            }
        });
    }


    function getNodeIndex(node) {
        var index = 0;
        while ( (node = node.previousSibling) ) {
            if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
                index++;
            }
        }
        return index;
    }