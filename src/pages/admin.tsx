/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { HI } from "@/shared";
import { Project } from "@/types/Project";
import axios from "axios";
import Lottie from "lottie-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";

const Admin = () => {
    const { data: session } = useSession();
    const [projects, setProject] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [approvalStatus, setApprovalStatus] = useState<{
        [key: string]: string;
    }>({});

    const handleSearchInputChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project =>
            project.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    const tableRef = useRef<HTMLElement | null>(null);

    const adjustSearchActionWidth = () => {
        if (tableRef.current) {
            const tableWidth = tableRef.current.clientWidth;
            const searchActionSection = document.getElementById(
                "search-action-section"
            );
            if (searchActionSection) {
                searchActionSection.style.width = `${tableWidth}px`;
            }
        }
    };

    const Approve_project = async (projectId: string) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        await axios
            .post("/api/admin", { projectId, approved: true }, config)
            .then(res => {
                console.log(`project approved details:${res.data}`);
                setApprovalStatus(prevState => ({
                    ...prevState,
                    [projectId]: "Approved",
                }));
                toast.success("Project Approved", {
                    theme: "dark",
                    autoClose: 3000,
                    closeButton: true,
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    const Reject_project = async (projectId: string) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            await axios.post(
                "/api/admin",
                { projectId, approved: false },
                config
            );
            setApprovalStatus(prevState => ({
                ...prevState,
                [projectId]: "Rejected",
            }));
            console.log(`project reject details:${approvalStatus[projectId]}`);
            toast.error("Project Rejected", {
                theme: "dark",
                autoClose: 3000,
                closeButton: true,
            });
        } catch (err) {
            console.log(err);
        }
        console.log("project rejected");
    };

    useEffect(() => {
        const fetchProjects = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await axios
                .get("/api/admin", config)
                .then(res => {
                    console.log(`The project data returned is ${res.data}`);
                    setProject(res.data);
                    // Set initial approval status
                    const initialApprovalStatus = res.data.reduce(
                        (accumulator: any, project: Project) => {
                            if (project.approved === undefined) {
                                accumulator[project._id] = undefined;
                            } else {
                                accumulator[project._id] = project.approved
                                    ? "Approved"
                                    : "Rejected";
                            }
                            return accumulator;
                        },
                        {}
                    );
                    setApprovalStatus(initialApprovalStatus);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        adjustSearchActionWidth();
        window.addEventListener("resize", adjustSearchActionWidth);
        return () => {
            window.removeEventListener("resize", adjustSearchActionWidth);
        };
    }, []);

    useEffect(() => {
        adjustSearchActionWidth();
    }, [filteredProjects]);

    return (
        <div className="flex flex-col">
            {/* For smaller screens (centered) */}
            <div
                className="sm:hidden md:pt-28  md:px-20 px-8 text-nav-text font-bold flex flex-col items-center justify-center"
                style={{ paddingTop: "4rem" }}
            >
                <div style={{ width: "10rem" }}>
                    <Lottie animationData={HI} height={50} width={50} />
                </div>
                <p
                    className="text-lg"
                    style={{ marginTop: "-0.5rem", marginBottom: "0.5rem" }}
                >
                    Welcome {session?.user?.name}
                </p>
                <p className="text-lg text-[#ff2bc1]  animate-pulse">
                    Pending approval!
                </p>
            </div>
            {/* For medium and larger screens */}
            <div
                className="md:pt-28 md:px-20 px-8 pb-4 text-nav-text font-bold
             items-center"
                style={{ paddingTop: "1rem" }}
            >
                {/* For medium and larger screens */}
                <div
                    className="hidden sm:flex items-center justify-center"
                    style={{ paddingTop: "6rem" }}
                >
                    <div className="text-[#ff2bc1] lg:text-4xl md:text-3xl sm:text-2xl text-xs text-center justify-self-start">
                        <p className="animate-pulse">Pending approval!</p>
                    </div>
                    <div className="flex flex-row items-center gap-0 justify-self-end">
                        <div className="w-[15vw]">
                            <Lottie animationData={HI} height={50} width={50} />
                        </div>
                        <p className="lg:text-4xl md:text-3xl sm:text-2xl text-xs">
                            Welcome {session?.user?.name}
                        </p>
                    </div>
                </div>
            </div>

            <div className="md:px-20 px-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div
                        id="search-action-section"
                        className="flex flex-wrap items-center justify-between pb-4 bg-white dark:bg-gray-900 py-4 px-12"
                    >
                        <div className="flex items-center mr-4">
                            <button
                                id="dropdownActionButton"
                                data-dropdown-toggle="dropdownAction"
                                className="md:pl-4 inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                type="button"
                            >
                                <span className="sr-only">Action button</span>
                                Action
                                <svg
                                    className="w-3 h-3 ml-2"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>

                            <div
                                id="dropdownAction"
                                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                            >
                                <ul
                                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownActionButton"
                                >
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Reward
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Promote
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Activate account
                                        </a>
                                    </li>
                                </ul>
                                <div className="py-1">
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Delete User
                                    </a>
                                </div>
                            </div>
                        </div>
                        <label htmlFor="table-search" className="sr-only">
                            Search
                        </label>
                        <div className="flex-grow">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search-users"
                                    className="block p-2 pl-8 pr-3 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search for projects"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <table
                        ref={tableRef as React.RefObject<HTMLTableElement>}
                        className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                    >
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center"></div>
                                </th>
                                <th scope="col" className="px-4 py-3">
                                    Project Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Project Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Github link
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        {filteredProjects.map(project => (
                            <tbody key={project._id}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td></td>
                                    <td
                                        scope="row"
                                        className="flex items-center px-4 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={project.image}
                                            alt="Jese image"
                                        />
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">
                                                {project.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 overflow-auto whitespace-normal max-w-xs">
                                        {project.description}
                                    </td>
                                    <td className="px-4 py-4 cursor-pointer hover:underline overflow-auto whitespace-normal max-w-xs">
                                        <div className="flex items-center">
                                            <a href={project.github}>
                                                {project.github}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {approvalStatus[project._id] ? (
                                            <span
                                                className={
                                                    approvalStatus[
                                                        project._id
                                                    ] === "Approved"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }
                                            >
                                                {approvalStatus[project._id]}!
                                            </span>
                                        ) : (
                                            <div className="text-sm text-gray-700 border-gray-200 gap-x-16 dark:border-gray-700 flex flex-row gap-0">
                                                <div>
                                                    <a
                                                        href="#"
                                                        onClick={() =>
                                                            Approve_project(
                                                                project._id
                                                            )
                                                        }
                                                        className="text-white block w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900"
                                                    >
                                                        Approve
                                                    </a>
                                                </div>
                                                <div>
                                                    <a
                                                        href="#"
                                                        onClick={() =>
                                                            Reject_project(
                                                                project._id
                                                            )
                                                        }
                                                        className="text-white block w-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-6 py-2.5 text-center dark:focus:ring-blue-900"
                                                    >
                                                        Reject
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
