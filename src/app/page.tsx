"use client"
// Should be in .env
import {useCallback, useState} from "react";
import {useMutation} from "react-query";
// import {PDFViewer} from "pdf-viewer-reactjs"
// import {Document, Page} from "react-pdf";
// import {useResizeObserver} from '@wojtekmaj/react-hooks';
// import {pdfjs, Document, Page} from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
//
// import type {PDFDocumentProxy} from 'pdfjs-dist';
//
const BACKEND_IP = "http://95.217.134.12:4010"
const API_KEY = "78684310-850d-427a-8432-4a6487f6dbc4"
const namespace = BACKEND_IP + `/create-pdf?apiKey=${API_KEY}`
// console.log("namespace", namespace)
//
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();
//
// const options = {
//     cMapUrl: '/cmaps/',
//     standardFontDataUrl: '/standard_fonts/',
// };
//
// const resizeObserverOptions = {};
//
// const maxWidth = 800;
//
// type PDFFile = string | File | null;
//
// function Sample({data}) {
//     const [file, setFile] = useState<PDFFile>('./sample.pdf');
//     const [numPages, setNumPages] = useState<number>();
//     const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
//     const [containerWidth, setContainerWidth] = useState<number>();
//
//     const onResize = useCallback<ResizeObserverCallback>((entries) => {
//         const [entry] = entries;
//
//         if (entry) {
//             setContainerWidth(entry.contentRect.width);
//         }
//     }, []);
//
//     useResizeObserver(containerRef, resizeObserverOptions, onResize);
//
//     function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
//         const {files} = event.target;
//
//         const nextFile = files?.[0];
//
//         if (nextFile) {
//             setFile(nextFile);
//         }
//     }
//
//     function onDocumentLoadSuccess({numPages: nextNumPages}: PDFDocumentProxy): void {
//         setNumPages(nextNumPages);
//     }
//
//     return (
//         <div className="Example">
//             <header>
//                 <h1>react-pdf sample page</h1>
//             </header>
//             <div className="Example__container">
//                 <div className="Example__container__load">
//                     <label htmlFor="file">Load from file:</label>{' '}
//                     <input onChange={onFileChange} type="file"/>
//                 </div>
//                 <div className="Example__container__document" ref={setContainerRef}>
//                     <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
//                         {Array.from(new Array(numPages), (_el, index) => (
//                             <Page
//                                 key={`page_${index + 1}`}
//                                 pageNumber={index + 1}
//                                 width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
//                             />
//                         ))}
//                     </Document>
//                 </div>
//             </div>
//         </div>
//     );
// }

export default function Home() {
    const [input, setInput] = useState("")

    const [pdfData, setPdfData] = useState(null);

    const {mutate, isLoading, isError, isSuccess} = useMutation({
        mutationFn: async (text) => {
            const response = await fetch(`${namespace}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({text}), // Send input as JSON
            });

            if (!response.ok) {
                throw new Error("Failed to convert to PDF");
            }
            const pdfData = await response.blob();
            console.log('pdfData', pdfData)
            return pdfData;
        },
        onSuccess: (blob) => {
            console.log("PDF conversion successful:", blob);

            // Convert the Blob to an ArrayBuffer
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;

                // Load the PDF using PSPDFKit
                if (arrayBuffer) {
                    import('pspdfkit').then((PSPDFKit) => {
                        const container = document.getElementById("pdf-container");
                        if (container && PSPDFKit) {
                            PSPDFKit.unload(container); // Ensure previous instance is unloaded
                            PSPDFKit.load({
                                container: container,
                                document: arrayBuffer, // Pass ArrayBuffer here
                                baseUrl: `${window.location.protocol}//${window.location.host}/`,
                            });
                        }
                    });
                }
            };

            // Read the Blob as ArrayBuffer
            reader.readAsArrayBuffer(blob);
        },
        // onSuccess: (data) => {
        //     console.log("PDF conversion successful:", data);
        //     // Handle the successful result here (e.g., store it in state or redirect)
        // },
    });

    const handleSubmit = () => {
        if (input.trim()) {
            mutate(input);
        }
    };
    return (
        <main className="flex flex-row h-full min-h-screen w-full justify-between p-4">
            <div className="grow max-w-[50%] rounded border border-gray-200 bg-gray-50 shadow-md">
                {/*<PDFViewer*/}
                {/*    document={{*/}
                {/*        url: URL.createObjectURL(pdfData),*/}
                {/*    }}*/}
                {/*/>*/}
                {/*<Document file={pdfData}>*/}
                {/*    <Page pageNumber={1}/>*/}
                {/*</Document>*/}
                {/*<Sample data={pdfData}/>*/}
                <div id="pdf-container" style={{height: '100vh'}}></div>
            </div>
            <div className="flex flex-col justify-center items-center w-[40%] p-6">
                <label
                    htmlFor="large-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Large Input
                </label>
                <input
                    type="text"
                    id="large-input"
                    onChange={(e) => setInput(e.target.value)}
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <button type="button"
                        onClick={() => handleSubmit()}
                        className="py-2.5 px-5 me-2 mb-2 mt-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Конвертувати
                    в PDF
                </button>
            </div>
        </main>
    );
}
