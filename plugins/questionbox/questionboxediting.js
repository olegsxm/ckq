import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command'
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';

function createQuestionBox(writer) {
    const id = Date.now();
    const questionBox = writer.createElement('questionBox', {id}); 
    const header = writer.createElement('questionBoxHeader');

    const leftArrow = writer.createElement('questionBoxLeftArrow');
    writer.insert(writer.createText(`<==`), writer.createPositionAt( leftArrow, 0 )); 

    const rightArrow = writer.createElement('questionBoxRightArrow');
    writer.insert(writer.createText(`==>`), writer.createPositionAt( rightArrow, 0 ));

    const title = writer.createElement('questionBoxTitle');
    writer.insert(writer.createText(`Title id - ${id}`), writer.createPositionAt(title, 0));

    const currentAnswer = writer.createElement('questionBoxHeaderCurrentAnswer');
    
    const yes = writer.createElement('questionBoxAnswer');
    writer.insert(writer.createText(`Yes`), writer.createPositionAt( yes, 0 ));
    const no = writer.createElement('questionBoxAnswer');
    writer.insert(writer.createText(`No`), writer.createPositionAt( no, 0 ));

    writer.append(yes, currentAnswer);
    writer.append(no, currentAnswer);
    writer.append(leftArrow, header);
    writer.append(rightArrow, header);
    writer.append(title, header);
    writer.append(currentAnswer, header);

    const body = writer.createElement('questionBoxBody');
    const a1 = writer.createElement('questionBoxBodyAnswer');
    writer.insert(writer.createText('Yes'), writer.createPositionAt(a1, 0));
    const a2 = writer.createElement('questionBoxBodyAnswer');
    writer.insert(writer.createText('No'), writer.createPositionAt(a2, 0)); 
    writer.append(a1, body);
    writer.append(a2, body);

    writer.append(header, questionBox);
    writer.append(body, questionBox);
    return questionBox;
}

class InsertQuestionBoxCommand extends Command {
    execute() {
        this.editor.model.change(writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            this.editor.model.insertContent(createQuestionBox(writer));
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'questionBox');

        this.isEnabled = allowedIn !== null;
    }
}


export default class QuestionBoxEditing extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('insertQuestionBox', new InsertQuestionBoxCommand(this.editor))
    }

    static get requires() {
        return [Widget]
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('questionBox', {
            isObject: true,
            allowWhere: '$block',
            allowAttributes: [ 'id' ]
        });

        schema.register('questionBoxHeader', {
            isLimit: true,
            allowIn: 'questionBox',
            allowContentOf: '$block',
        })

        schema.register('questionBoxLeftArrow', {
            isLimit: true,
            allowIn: 'questionBoxHeader',
            allowContentOf: '$block',
        })

        schema.register('questionBoxRightArrow', {
            isLimit: true,
            allowIn: 'questionBoxHeader',
            allowContentOf: '$block'
        });
        
        schema.register('questionBoxTitle', {
            isLimit: true,
            allowIn: 'questionBoxHeader',
            allowContentOf: '$block'
        });

        schema.register('questionBoxHeaderCurrentAnswer', {
            isLimit: true,
            allowIn: 'questionBoxHeader',
            allowContentOf: '$block'
        })

        schema.register('questionBoxAnswer', {
            isLimit: true,
            allowIn: 'questionBoxHeaderCurrentAnswer',
            allowContentOf: '$block',
            attributes: ['data-hidden']
        })


        schema.register('questionBoxBody', {
            isLimit: true,
            allowIn: 'questionBox',
            allowContentOf: '$block'
        })

        schema.register('questionBoxBodyAnswer', {
            isLimit: true,
            allowIn: 'questionBoxBody',
            allowContentOf: '$block',
            isContent: true
        })

    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        QuestionBoxConversion(conversion);
        QuestionBoxHeaderConversion(conversion);
        QuestionBoxLeftArrowConversion(conversion);
        QuestionBoxRightArrowConversion(conversion);
        QuestionBoxHeaderCurrentAnswerConversion(conversion);
        QuestionBoxHeaderAnswerConversion(conversion);
        QuestionBoxBodyConversion(conversion);
        QuestionBoxAnswerConversion(conversion);
    }
}

const QuestionBoxConversion = conversion => {
    conversion.for('upcast').elementToElement({
        view: {
            name: 'section',
            classes: 'question-box'
        },
        model: (viewElement, { writer: modelWriter }) => {
            return modelWriter.createElement('questionBox', {
                id: parseInt(viewElement.getAttribute('data-id'))
            })
        }
    })

    conversion.for('dataDowncast').elementToElement({
        model: 'questionBox',
        view: ( modelElement, { writer: viewWriter } ) => {
            // const section = viewWriter.createContainerElement( 'section', { class: 'question-box' } );

            // return toWidget( section, viewWriter, { label: 'question box widget' } );
            return viewWriter.createContainerElement('section', {
                class: 'question-box',
                'data-id': modelElement.getAttribute('id')
            })
        }
    })

    conversion.for( 'editingDowncast' ).elementToElement( {
        model: 'questionBox',
        view: ( modelElement, { writer: viewWriter } ) => {

            const id = modelElement.getAttribute( 'id' );
            const section = viewWriter.createContainerElement( 'section', {
                class: 'question-box',
                'data-id': id
            } );

            return toWidget( section, viewWriter, { label: 'product preview widget' } );
        }
    } );
}

const QuestionBoxHeaderConversion = conversion => {
    conversion.for('upcast').elementToElement({
        view: {
            name: 'div',
            classes: 'question-box__header'
        },
        model: (viewElement, {writer: modelWriter}) => {
            return modelWriter.createElement('questionBoxHeader')
        }
    })

    conversion.for('downcast').elementToElement({
        model: 'questionBoxHeader',
        view: (modelElement, {writer: viewWriter}) => {
            return viewWriter.createContainerElement('div', {
                class: 'question-box__header'
            })
        }
    })

    // conversion.for('editingDowncast', {
    //     model: 'questionBoxHeader',
    //     view: (modelElement, { writer: viewWriter }) => {
    //         const div = viewWriter.createElement('div', {
    //             class: 'question-box__header'
    //         })

    //         return toWidget(div, viewWriter, {label: 'header'});
    //     }
    // })
}

const QuestionBoxLeftArrowConversion = conversion => {
    conversion.for('upcast').elementToElement({
        model: 'questionBoxLeftArrow',
        view: {
            name: 'span',
            classes: ['question-box__arrow', 'question-box__arrow--left']
        }
    })

    conversion.for('downcast').elementToElement({
        model: 'questionBoxLeftArrow',
        view: {
            name: 'span',
            classes: ['question-box__arrow', 'question-box__arrow--left']
        }
    })
}

const QuestionBoxRightArrowConversion = conversion => {
    conversion.for('upcast').elementToElement({
        model: 'questionBoxRightArrow',
        view: {
            name: 'span',
            classes: ['question-box__arrow', 'question-box__arrow--right']
        }
    })

    conversion.for('downcast').elementToElement({
        model: 'questionBoxRightArrow',
        view: {
            name: 'span',
            classes: ['question-box__arrow', 'question-box__arrow--right']
        }
    })
}

const QuestionBoxHeaderCurrentAnswerConversion = conversion => {
    conversion.for('upcast').elementToElement({
        view: {
            name: 'div',
            classes: 'question-box__header__current-answer'
        },
        model: (viewElement, {writer: modelWriter}) => {
            return modelWriter.createElement('questionBoxHeaderCurrentAnswer')
        }
    })

    conversion.for('downcast').elementToElement({
        model: 'questionBoxHeaderCurrentAnswer',
        view: (modelElement, {writer: viewWriter}) => {
            return viewWriter.createContainerElement('div', {
                class: 'question-box__header__current-answer'
            })
        }
    })
}

const QuestionBoxHeaderAnswerConversion = conversion => {
   conversion.for('upcast').elementToElement({
            view: {
                name: 'div',
                classes: 'question-box__header__answer'
            },
            model:  (viewElement, { writer: modelWriter }) => {
                return modelWriter.createElement('questionBoxAnswer', {
                    'data-hidden': viewElement.getAttribute('data-hidden')
                })
            }
        })
    
    conversion.for('downcast').elementToElement({
        model: 'questionBoxAnswer',
        view: ( modelElement, { writer: viewWriter } ) => {
           const div = viewWriter.createContainerElement('div', {
               class: 'question-box__header__answer',
               'data-hidden': modelElement.getAttribute('data-hidden')
           })

           return div;
        }
    })
}

const QuestionBoxBodyConversion = conversion => {
    conversion.for('upcast').elementToElement({
        model: 'questionBoxBody',
        view: {
            name: 'div',
            classes: 'question-box__body'
        }
    })
    conversion.for('downcast').elementToElement({
        model: 'questionBoxBody',
        view: {
            name: 'div',
            classes: 'question-box__body'
        }
    })
}

const QuestionBoxAnswerConversion = conversion => {
    conversion.for('upcast').elementToElement({
        view: {
            name: 'div',
            classes: 'question-box__answer',
        },
        model: (viewElement, { writer: modelWriter }) => {
            return modelWriter.createElement('questionBoxBodyAnswer', {
                'data-hidden': viewElement.getAttribute('data-hidden')
            })
        }
    })

    // conversion.for('downcast').elementToElement({
    //     model: 'questionBoxBodyAnswer',
    //     view: ( modelElement, { writer: viewWriter } ) => {
    //         const div = viewWriter.createEditableElement( 'div',{ 
    //             class: 'question-box__answer',
    //             'data-hidden': modelElement.getAttribute('data-hidden')
    //         }
    //         );

    //         return toWidgetEditable( div, viewWriter );
    //     }
    // })

    conversion.for('dataDowncast').elementToElement({
        model: 'questionBoxBodyAnswer',
        view: ( modelElement, { writer: viewWriter } ) => {
            const div = viewWriter.createEditableElement( 'div',{ 
                class: 'question-box__answer',
                'data-hidden': modelElement.getAttribute('data-hidden')
            }
            );

            return toWidgetEditable( div, viewWriter );
        }
    })

    conversion.for( 'editingDowncast' ).elementToElement( { 
        model: 'questionBoxBodyAnswer',
        view: ( modelElement, { writer: viewWriter } ) => {
            const hidden = modelElement.getAttribute('data-hidden' )
            const div = viewWriter.createEditableElement('div', {
                class: 'question-box__answer',
                'data-hidden': hidden
            })

            return toWidgetEditable(div, viewWriter);
        }
    } )
}