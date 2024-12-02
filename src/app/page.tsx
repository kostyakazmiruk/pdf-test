"use client"
import {useCallback, useState} from "react";
import {useMutation} from "react-query";

// Should be in .env
const BACKEND_IP = "http://95.217.134.12:4010"
const API_KEY = "78684310-850d-427a-8432-4a6487f6dbc4"
// Stays here anyway
const namespace = BACKEND_IP + `/create-pdf?apiKey=${API_KEY}`


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
    });

    const handleSubmit = () => {
        if (input.trim()) {
            mutate(input);
        }
    };
    return (
        <main className="flex flex-row h-full min-h-screen w-full justify-between p-4">
            <div className="grow max-w-[50%] rounded border border-gray-200 bg-gray-50 shadow-md">

                <div id="pdf-container" style={{height: '100vh'}}></div>
            </div>
            <div className="flex flex-col justify-center items-center w-[40%] p-6">
                <label
                    htmlFor="large-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Type your code, that you want to render as PDF
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
