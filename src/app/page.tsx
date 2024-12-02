import Image from "next/image";

export default function Home() {
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
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
        </main>
    );
}
