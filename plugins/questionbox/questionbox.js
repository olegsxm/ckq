import QuestionBoxUI from "./questionboxui";
import QuestionBoxEditing from "./questionboxediting";
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class QuestionBox extends Plugin {
    static get requires() {
        return [QuestionBoxEditing, QuestionBoxUI]
    }
}