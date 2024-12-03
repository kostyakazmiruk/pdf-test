"use client";

import {Sidebar} from "flowbite-react";
import {HiArrowSmRight, HiInbox} from "react-icons/hi";
import {useEffect, useState} from "react";

// Function to get chat keys from localStorage
const getChatKeysFromLocalStorage = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!isNaN(key)) {
            keys.push(Number(key));
        }
    }
    return keys;
};

// Function to get the next available chat number (avoids gaps in keys)
const getNextChatNumber = (keys: number[]) => {
    let nextNumber = 1;
    // Keep increasing the next number until we find one that doesn't exist
    while (keys.includes(nextNumber)) {
        nextNumber++;
    }
    return nextNumber;
};

// Function to create a new chat
const createNewChat = (nextChatNumber: number) => {
    const chatKey = nextChatNumber.toString();
    localStorage.setItem(chatKey, ''); // Set the new chat in localStorage
};

export default function Component() {
    const [chatKeys, setChatKeys] = useState<number[]>([]);

    // Fetch chat keys from localStorage and set them to state
    useEffect(() => {
        const keys = getChatKeysFromLocalStorage();
        setChatKeys(keys);
    }, []);

    // Handle creating a new chat and updating the sidebar
    const handleCreateNewChat = () => {
        const nextChatNumber = getNextChatNumber(chatKeys); // Get the next available chat number
        createNewChat(nextChatNumber); // Create the new chat in localStorage
        setChatKeys((prevChatKeys) => [...prevChatKeys, nextChatNumber]); // Update state to trigger re-render
    };

    // Dynamically calculate next chat number
    const nextChatNumber = getNextChatNumber(chatKeys);

    const chatSidebarItems = [
        {
            name: "New Chat",
            href: `/${nextChatNumber}`, // Link to the new chat dynamically
            icon: HiArrowSmRight,
            onClick: handleCreateNewChat
        },
        ...chatKeys.sort((a, b) => a - b).map((key) => ({
            name: `Chat ${key}`,
            href: `/${key}`,
            icon: HiInbox
        })),
    ];

    return (
        <Sidebar aria-label="Default sidebar example">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    {chatSidebarItems.map((item) => (
                        <Sidebar.Item
                            key={item.name}
                            href={item.href}
                            icon={item.icon}
                            onClick={item.onClick}
                        >
                            {item.name}
                        </Sidebar.Item>
                    ))}
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
