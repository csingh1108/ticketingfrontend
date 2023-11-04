import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import TicketMenu from '../TicketMenu';
import {
    formatDate, formatPriority,
    formatTimeDifference,
    getPriorityColor,
    getPriorityColorBackground,
    rowBackgroundColors,
} from '../UtilityMethods';
import Comments from '../Comments';
import {GET_ALL_TICKETS, GET_TICKET, UPDATE_TICKET, GET_ALL_USERS, DISSOCIATE_TICKET_FROM_USER, ASSOCIATE_TICKET_WITH_USER} from "../ServiceQueries";

const TicketDetail = () => {
    const {ticketId} = useParams()
    const { loading, error, data } = useQuery(GET_TICKET, {
        variables: { ticketId },
    });
    const [updateTicket] = useMutation(UPDATE_TICKET);
    const { loading: usersLoading, data: usersData } = useQuery(GET_ALL_USERS);
    const [dissociateTicketFromUser] = useMutation(DISSOCIATE_TICKET_FROM_USER);
    const [associateTicketWithUser] = useMutation(ASSOCIATE_TICKET_WITH_USER);

    const [ticket, setTicket] = useState([]);
    const [showEditMode, setShowEditMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [engiUsers, setEngiUsers] = useState([]);
    const [selectedEngineer, setSelectedEngineer] = useState(null);
    const [prevEng, setPrevEng] = useState(null);


    useEffect(() => {
        if (data) {
            setTicket(data.getTicket);
            if (data.getTicket.assignedTo) {
                setPrevEng(data.getTicket.assignedTo.id);
            } else {
                setPrevEng(null);
            }
        }
    }, [data]);

    useEffect(() => {
        if (usersData && usersData.getAllUsers) {
            const users = usersData.getAllUsers.map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                title: user.title,
            }));
            setEngiUsers(users);
        }
    }, [usersData]);

    const engineerOptions = engiUsers.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
    }));

    function changeEditMode() {
        setShowEditMode(!showEditMode);
    }

    const handleFieldChange = (fieldName, value) => {
        setTicket({
            ...ticket,
            [fieldName]: value,
        });
    };

    const saveChanges = () => {
        const updatedTicketData = {
            ticketId: ticket.ticketId,
            status: ticket.status,
            details: ticket.details,
            priority: ticket.priority,
            source: ticket.source,
            assignedTo: selectedEngineer,
            ticketType: ticket.ticketType,
            description: ticket.description,
        };

        if (prevEng && prevEng !== selectedEngineer) {
            dissociateTicketFromUser({
                variables: {
                    userId: prevEng,
                    ticketId: ticket.ticketId,
                },
            })
                .then(() => {
                    // Disassociation successful
                })
                .catch(error => {
                    console.error('Error dissociating ticket: ' + error.message);
                });
        }

        if (prevEng && prevEng !== selectedEngineer) {
            associateTicketWithUser({
                variables: {
                    userId: selectedEngineer,
                    ticketId: ticket.ticketId,
                },
            })
                .then(() => {
                    // Association successful
                })
                .catch(error => {
                    console.error('Error associating ticket: ' + error.message);
                });
        }

        updateTicket({
            variables: updatedTicketData,
            update: (cache, { data }) => {
                cache.writeQuery({
                    query: GET_TICKET,
                    variables: { ticketId },
                    data: { getTicket: { ...ticket, assignedTo: selectedEngineer } },
                });
            },
        })
            .then(() => {
                setSuccessMessage('Ticket successfully updated');
                changeEditMode();
                setTimeout(() => setSuccessMessage(null), 3000);
            })
            .catch(error => {
                setErrorMessage('Error updating ticket: ' + error.message);
                setTimeout(() => setErrorMessage(null), 3000);
            });

        changeEditMode();
    };


    const cancelChanges = () => {
        setTicket(ticket);
        changeEditMode();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container mx-auto px-4 sm:px-8">
            <TicketMenu seachValue={false}></TicketMenu>
            {successMessage && (
                <div className="bg-green-200 border-green-500 text-green-800 border-l-4 p-4 mt-4">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-200 border-red-500 text-red-800 border-l-4 p-4 mt-4">
                    {errorMessage}
                </div>
            )}
            <div className="px-4 sm:px-0 mt-6 flex justify-between">
                <div>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Ticket Information</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Ticket details and comments.</p>
                </div>
                <div className="mr-8 mt-4">
                    <button
                        onClick={showEditMode ? saveChanges : changeEditMode}
                        className="rounded border-2 border-blue-400 px-2 py-1 bg-blue-400 hover:bg-blue-500 active:bg-red-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {showEditMode ? 'Save' : 'Edit'}
                    </button>
                    {showEditMode && (
                        <button
                            onClick={cancelChanges}
                            className="ml-1 rounded border-2 border-red-400 px-2 py-1 bg-red-400 hover:bg-red-500 active:bg-blue-700 focus:outline-none focus:ring focus:ring-red-300"
                        >
                            Cancel
                        </button>
                    )}

                </div>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <div className="text-center">
                            <div className="text-sm font-medium leading-6 text-gray-900">ID:</div>
                            <div className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{ticket.ticketId}</div>
                        </div>

                        <div className={`${rowBackgroundColors[ticket.status]} text-center`}>
                            <div className="text-sm font-medium leading-6 text-gray-900">Status:</div>
                            {showEditMode ? (
                                <select
                                    value={ticket.status || ''}
                                    onChange={(e) => handleFieldChange('status', e.target.value)}
                                    className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 rounded-md"
                                >
                                    <option value="NEW">NEW</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="BLOCKED">BLOCKED</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="RE_OPENED">RE_OPENED</option>
                                    <option value="OPEN">OPEN</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            ) : (
                                <div className={`status-background mt-1 text-sm leading-6 text-gray-700 sm:mt-0`}>
                                    {ticket.status}
                                </div>
                            )}
                        </div>

                        <div className={`${getPriorityColorBackground(formatPriority(ticket.priority))} text-center`}>
                            <div className="text-sm font-medium leading-6 text-gray-900">Priority:</div>
                            {showEditMode ? (
                                <select
                                    value={ticket.priority || ''}
                                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                                    className={`mt-1 text-sm leading-6 
                                    text-gray-700 sm:mt-0 rounded-md
                                    ${getPriorityColor(formatPriority(ticket.priority))}`}
                                >
                                    <option value="NONE">None</option>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="SEVERE">Severe</option>
                                </select>
                            ) : (
                                <div className={`mt-1 text-sm leading-6 text-gray-700 sm:mt-0 ${getPriorityColor(formatPriority(ticket.priority))}`}>
                                    {formatPriority(ticket.priority)}
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <div className="text-sm font-medium leading-6 text-gray-900">Submitted Date:</div>
                            <div className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{formatDate(ticket.submittedDate)}</div>
                        </div>

                        <div className="text-center">
                            <div className="text-sm font-medium leading-6 text-gray-900">Last Updated:</div>
                            <div className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{formatTimeDifference(ticket.lastUpdatedDate)}</div>
                        </div>

                        <div className="text-center">
                            <div className="text-sm font-medium leading-6 text-gray-900">Closed Date:</div>
                            <div className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{ticket.closedDate}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-m font-medium leading-6 text-gray-900 mt-5 ml-24">
                            Assigned To:
                            {showEditMode ? (
                                <select
                                    value={prevEng || ''}
                                    onChange={(e) => setSelectedEngineer(e.target.value)}
                                    className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 rounded-md"
                                >
                                    {engineerOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Link to={`/user/${ticket.assignedTo?.id}`} className="text-blue-600 ml-4">
                                    {`${ticket.assignedTo?.firstName} ${ticket.assignedTo?.lastName}`}
                                </Link>
                            )}
                        </div>
                    </div>
                </dl>
                <div>
                    <div className=" border-t-2 flex mt-4 ml-20 items-center">
                        <div className="text-lg font-medium leading-6 text-gray-900 p-3">Title:</div>
                        {showEditMode ? (
                            <textarea
                                rows="1"
                                value={ticket.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 rounded-md w-full"
                            />
                        ) : (
                            <div className={`mt-1 text-m text-gray-700 sm:mt-0.5`}>{ticket.description}</div>
                        )}
                    </div>

                    <div className=" border-b-2 flex ml-20 items-center mt-2">
                        <div className="text-sm font-medium leading-6 text-gray-900 p-3">Details: </div>
                        {showEditMode ? (
                            <textarea
                                rows="3"
                                value={ticket.details}
                                onChange={(e) => handleFieldChange('details', e.target.value)}
                                className="mt-1 text-sm leading-6 text-gray-700 sm:mt rounded-md w-full"
                            />
                        ) : (
                            <div className={`mt-1 text-sm text-gray-700 sm:mt`}>{ticket.details}</div>
                        )}
                    </div>
                </div>

                <div className="mt-4 ml-20 items-center">
                    <div className="text-m font-medium leading-6 text-gray-900 mt-5">Comments:</div>
                    <div className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0 p-3">
                        {ticket.comments && Array.isArray(ticket.comments) ? (
                            ticket.comments.map(comment => (
                                <Comments key={comment.commentId} commentId={comment.commentId} />
                            ))
                        ) : (
                            <p>No comments available</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TicketDetail;
