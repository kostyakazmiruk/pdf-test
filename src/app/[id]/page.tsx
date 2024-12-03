"use client"
import {useCallback, useEffect, useState, use} from "react";
import {useMutation} from "react-query";
import useFileHistoryStore from "@/hooks/useFileHistoryStore";
import {useRouter} from "next/navigation";

// Should be in .env
const BACKEND_IP = "http://95.217.134.12:4010"
const API_KEY = "78684310-850d-427a-8432-4a6487f6dbc4"
// Stays here anyway
const namespace = BACKEND_IP + `/create-pdf?apiKey=${API_KEY}`

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
}

// Updated renderPDF function
const renderPDF = async (id, arrayBuffer) => {
    const PSPDFKit = await import('pspdfkit');
    const container = document.getElementById("pdf-container");
    if (!container) return;

    // Save PDF to localStorage as Base64
    if (arrayBuffer) {
        const base64Data = arrayBufferToBase64(arrayBuffer);
        localStorage.setItem(id, base64Data);
    }

    // Retrieve Base64 data from localStorage and convert to ArrayBuffer
    const savedBase64 = localStorage.getItem(id);
    if (savedBase64) {
        const savedBuffer = base64ToArrayBuffer(savedBase64);
        PSPDFKit.unload(container);
        PSPDFKit.load({
            container,
            document: savedBuffer,
            baseUrl: `${window.location.protocol}//${window.location.host}/`,
        });
    }
};


export default function Page({params}) {
    const {id} = use(params);
    const [input, setInput] = useState("")
    const [conversionHistory, setConversionHistory] = useState([]);
    const [pdfData, setPdfData] = useState(null);

    const [placeholder, setPlaceholder] = useState("")

    useEffect(() => {
        // Render PDF if we already have the data in localStorage
        if (id && localStorage.getItem(id)) {
            renderPDF(id);
        }
    }, [id]);


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
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                if (arrayBuffer) {
                    renderPDF(id, arrayBuffer); // Reuse the abstracted function
                }
            };
            reader.readAsArrayBuffer(blob);
        },
    });


    // handleRetrieve function
    const handleRetrieve = () => {
        // Step 1: Retrieve the Base64 encoded PDF data from localStorage by ID
        const pdfData = localStorage.getItem(`${id}`);

        if (pdfData) {
            // Step 2: Decode the Base64 string into raw binary data
            const byteCharacters = atob(pdfData);  // Decoding base64 to binary string
            let decodedData = "";

            // Step 3: Convert the binary string into a readable format (string) for input field
            for (let i = 0; i < byteCharacters.length; i++) {
                decodedData += String.fromCharCode(byteCharacters.charCodeAt(i)); // Convert each char
            }

            // Step 4: Set the decoded data as the placeholder in the input
            setPlaceholder(decodedData);
        } else {
            console.error("No PDF data found in localStorage.");
        }
    };


    return (
        <main className="flex flex-row h-full min-h-screen w-full justify-between p-4">
            <div className="grow max-w-[50%] rounded border border-gray-200 bg-gray-50 shadow-md">

                <div id="pdf-container" style={{height: '100vh'}}></div>
            </div>
            <div className="flex flex-col justify-center items-center w-[40%] p-6">
                {id && (<div>{`This is page: ${id}`}</div>)}
                <button type="button"
                        onClick={() => handleRetrieve()}
                        className="py-2.5 px-5 me-2 mb-2 mt-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    PDF intro placeholder
                </button>
                <label
                    htmlFor="large-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Type your code, that you want to render as PDF
                </label>
                <input
                    type="text"
                    id="large-input"
                    // placeholder={placeholder}
                    // value={placeholder}
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
