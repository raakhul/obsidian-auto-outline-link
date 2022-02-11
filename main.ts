import { MarkdownView, Plugin, TFile } from 'obsidian';


export default class AutomaticLinks extends Plugin {

	async onload() {

		this.addRibbonIcon("heading-glyph", "Outline Links", async () => {    

			const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
			const noteFile = this.app.workspace.getActiveFile(); // Currently Open Note
			if(!noteFile.name) return; // Nothing Open

			const headingsArray = await this.extractHeadings(noteFile);

			const selected=editor.getSelection();
			editor.replaceSelection(headingsArray.toString(),selected);
		});
	}

	onunload() {

	}

	//To Read contents of active file
	async extractHeadings(noteFile: TFile):  Promise<any[]> {
		
		// Read the currently open note file. We are reading it off the HDD - we are NOT accessing the editor to do this.
		let text = await this.app.vault.cachedRead(noteFile); //To read active cached file
		let extracted_headings=text.match(/^##[\s].+/gm); //To select lines which has only heading 2

		const headingsArray = extracted_headings.map(headings => {	//To Remove ## from selected headings
			let hashRemoved=headings.match(/(?![##\s]).+/gm);
			return hashRemoved;
		})
		
		let headingsLinkArray=this.generateHeadingsLink(headingsArray); //To Generate md links for headings 2

		return headingsLinkArray;
	}

	//To Generate md links for headings 2
	generateHeadingsLink (headings: RegExpMatchArray[]): any[] {

		let headingsArray: Array<String>;
		let headingsLinkArray = new Array();

		headingsArray = headings.toString().split(",");

		for (var i=0; i<headingsArray.length;i++) {

			let heading: String;

			//Construting md link by replacing whitespace with /
			if (i>=1 && i<(headingsArray.length-1)) {
				heading=" [".concat(headingsArray[i].toString()).concat("](#").concat(headingsArray[i].toString().toLowerCase().replace(/\s/g,"/")).concat(")");
				headingsLinkArray.push(heading.toString());
			}
		}

		return headingsLinkArray;
	}
}
