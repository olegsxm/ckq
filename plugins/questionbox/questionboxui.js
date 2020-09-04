import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class QuestionBoxUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;
        editor.ui.componentFactory.add( 'questionBox', locale => {
            const command = editor.commands.get( 'insertQuestionBox' );
            const buttonView = new ButtonView( locale );

            buttonView.set( {
                label: t( 'Question Box' ),
                withText: true,
                tooltip: true
            } );

            buttonView.bind( 'isOn', 'isEnabled' )//.to( command, 'value', 'isEnabled' );

            this.listenTo( buttonView, 'execute', () => editor.execute( 'insertQuestionBox' ) );

            return buttonView; 
        } );
    }
}
