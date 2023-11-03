import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { useQuery } from '@apollo/client';
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
import {GET_ALL_TICKETS, GET_TICKET} from "../ServiceQueries";

const TicketDetail = () => {
    const {ticketId} = useParams()
    const { loading, error, data } = useQuery(GET_TICKET, {
        variables: { ticketId },
    });
    const [ticket, setTicket] = useState([]);

    useEffect(() => {
        if (data) {
            setTicket(data.getTicket);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container mx-auto px-4 sm:px-8">
            <TicketMenu />
            <div className="px-4 sm:px-0 mt-6">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Ticket Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Ticket details and comments.</p>
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
                            <div className={`status-background  mt-1 text-sm leading-6 text-gray-700 sm:mt-0`}>{ticket.status}</div>
                        </div>

                        <div className={`${getPriorityColorBackground(formatPriority(ticket.priority))} text-center `}>
                            <div className="text-sm font-medium leading-6 text-gray-900">Priority:</div>
                            <div className={`mt-1 text-sm leading-6 text-gray-700 sm:mt-0 ${getPriorityColor(formatPriority(ticket.priority))}`}>{formatPriority(ticket.priority)}</div>
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
                            {ticket.assignedTo ? (
                                <>
                                    <Link to={`/user/${ticket.assignedTo.id}`} className="text-blue-600 ml-4">
                                        {`${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`}
                                    </Link>
                                </>
                            ) : (
                                'Unassigned'
                            )}
                        </div>
                    </div>
                </dl>
                    <div>
                        <div className=" border-t-2 flex mt-4 ml-20 items-center">
                            <div className="text-lg font-medium leading-6 text-gray-900 p-3">Title:</div>
                            <div className="text-m text-gray-700 sm:mt-0.5">{ticket.description}</div>
                        </div>

                        <div className=" border-b-2 flex ml-20 items-center">
                            <div className="text-sm font-medium leading-6 text-gray-900 p-3">Details: </div>
                            <div className="text-sm text-gray-700 sm:mt">{ticket.details}</div>
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
