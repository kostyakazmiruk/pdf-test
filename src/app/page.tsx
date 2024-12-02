"use client"
// Should be in .env
import {useState} from "react";
import {useMutation} from "react-query";

const BACKEND_IP = "http://95.217.134.12:4010/create-pdf?apiKey=78684310-850d-427a-8432-4a6487f6dbc4"
const API_KEY = "78684310-850d-427a-8432-4a6487f6dbc4"
const namespace = BACKEND_IP + `/create-pdf?apiKey=${API_KEY}`
console.log("namespace", namespace)


export default function Home() {
    const [input, setInput] = useState("")

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
            console.log('response', response)
            return response.json(); // Process the response (if needed)
        },
    });

    const handleSubmit = () => {
        if (input.trim()) {
            mutate(input); // Trigger the mutation with the input value
        }
    };
    return (
        <main className="flex flex-row h-full min-h-screen w-full justify-between p-4">
            <div className="grow max-w-[50%] rounded border border-gray-200 bg-gray-50 shadow-md">
                This gonna be pdf
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
