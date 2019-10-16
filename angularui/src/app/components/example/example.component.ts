import { Component, AfterViewInit} from '@angular/core';
import { MustMatch } from '../../helpers/must-match.validator';
import { FormGroup, FormControl } from '@angular/forms';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';



@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements AfterViewInit {
  public Editor = ClassicEditorBuild;

	public demoReactiveForm = new FormGroup( {
		name: new FormControl( 'John' ),
		surname: new FormControl( 'Doe' ),
		description: new FormControl( '<p>A <b>really</b> nice fellow.</p>' ),
	} );

	public formDataPreview?: string;

	public ngAfterViewInit() {
		this.demoReactiveForm!.valueChanges
			.subscribe( values => {
				this.formDataPreview = JSON.stringify( values );
			} );
	}

	public onSubmit() {
		console.log( 'Form submit, model', this.demoReactiveForm.value );
	}

	public reset() {
		this.demoReactiveForm!.reset();
	}

	public get description() {
		return this.demoReactiveForm!.controls.description;
	}
}

