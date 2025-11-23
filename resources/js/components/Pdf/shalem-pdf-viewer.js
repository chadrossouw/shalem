import { LitElement,html,css } from "lit";
import { BaseClass } from "../BaseClass";
import { PaginationListener } from "../Pagination/pagination-listener.js";

export class ShalemPdfViewer extends PaginationListener(BaseClass(LitElement)) {
    static properties = {
        file: { type: String },
        pdfjsLib: { type: Object, state: true },
        pages: { type: Array, state: true },
        currentPage: { type: Number, state: true },
    }

    constructor(){
        super();
        this.pages = [
            html`<shalem-loader>Wiping off the dust...</shalem-loader>`
        ];
        this.baseURL = import.meta.env.VITE_BASE_URL; 
        this.currentPage = 0;
        this.numPages = 0;
        this.paginationID = `pdf-viewer`;
    }

    async connectedCallback(){
        super.connectedCallback();
        let module = await import('/node_modules/pdfjs-dist/build/pdf.min.mjs')
        console.log('PDF.js module and worker loaded:', module);
        this.pdfjsLib = module;
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = `${this.baseURL}static/pdf.worker.min.mjs`;

    }

    updated(changedProperties){
        if(changedProperties.has('pdfjsLib') && this.pdfjsLib){
            this._loadPdf();
        }
    }

    render(){
        if(!this.pdfjsLib){
            return html`<shalem-loader>Cleaning the lenses...</shalem-loader>`;
        }
        return html`
        <div class="bg_green bg_shade_2 inner_padding radius grid">
            <div class="bg_green bg_shade_1 radius-big pagination_container">
                <shalem-paginator 
                    currentPage=${this.currentPage + 1}
                    paginationID=${this.paginationID}
                    lastPage=${this.numPages}
                    next="Next page"
                    previous="Previous page"
                    buttonColor="green"
                ></shalem-paginator>
            </div>
            <div id="viewport-container">
                <div role="main" id="viewport">
                ${this.pages[this.currentPage]}
                </div>
            </div>
        </div>
        `;
    }

    _loadPdf(){
        if(!this.file){
            console.error('No file URL provided for PDF viewer.');
            return;
        }
        const loadingTask = this.pdfjsLib.getDocument(this.file);
        loadingTask.promise.then((pdf) => {
            this.numPages = pdf.numPages;
            const pagePromises = [];
            for(let pageNum = 1; pageNum <= this.numPages; pageNum++){
                pagePromises.push(
                    pdf.getPage(pageNum).then((page) => {
                        const scale = 1;
                        const viewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width; 
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        return page.render(renderContext).promise.then(() => {
                            return html`<div class="pdf-page">${canvas}</div>`;
                        });
                    })
                );
            }
            Promise.all(pagePromises).then((pages) => {
                this.pages = pages;
                console.log('All pages rendered:', this.pages);
            }
            );
        }, (reason) => {
            console.error('Error loading PDF:', reason);
        });
    }

    _handlePaginationChange(e){
        this.currentPage = e.detail.page - 1;
    }

    static styles = [
        ...super.styles,
        css`
            canvas {
                width: 100%;
            }
            .pagination_container{
                padding:1rem;
            }
        `
    ];
}