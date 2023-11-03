import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import TicketMenu from "../TicketMenu";
import {
    formatDate,
    formatPriority,
    formatStatus,
    formatTimeDifference,
    getPriorityColor, getPriorityColorBackground,
    rowBackgroundColors
} from "../UtilityMethods";
import {useQuery} from "@apollo/client";
import {GET_ALL_TICKETS} from "../ServiceQueries";

const TicketListView = () => {
    const { loading, error, data } = useQuery(GET_ALL_TICKETS);
    const [tickets, setTickets] = useState([]);

    const [statusSort, setStatusSort] = useState('asc');
    const [typeSort, setTypeSort] = useState('asc');
    const [prioritySort, setPrioritySort] = useState('asc');
    const statusOrder = ['NEW', 'OPEN', 'RE_OPENED', 'IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED'];
    const priorityOrder = ['LOW', 'MEDIUM', 'HIGH', 'SEVERE'];


    useEffect(() => {
        if (data) {
            setTickets(data.getAllTickets);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const sortByStatus = () => {
        const sorted = [...tickets].sort((a, b) => {
            const statusA = statusOrder.indexOf(a.status);
            const statusB = statusOrder.indexOf(b.status);
            return statusSort === 'asc' ? statusA - statusB : statusB - statusA;
        });
        setTickets(sorted);
        setStatusSort(statusSort === 'asc' ? 'desc' : 'asc');
    };

    const sortByType = () => {
        const sorted = [...tickets].sort((a, b) => {
            const typeComparison = a.type && b.type ? a.type.localeCompare(b.type) : 0;
            return typeSort === 'asc' ? typeComparison : -typeComparison;
        });
        setTickets(sorted);
        setTypeSort(typeSort === 'asc' ? 'desc' : 'asc');
    };

    const sortByPriority = () => {
        const sorted = [...tickets].sort((a, b) => {
            const priorityA = priorityOrder.indexOf(a.priority);
            const priorityB = priorityOrder.indexOf(b.priority);
            return prioritySort === 'asc' ? priorityA - priorityB : priorityB - priorityA;
        });
        setTickets(sorted);
        setPrioritySort(prioritySort === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                <TicketMenu/>
                <div className="min-h-screen flex justify-center">

                    <div className="w-4/5" style={{width:"2000px"}}>
                        <div className="bg-white p-5">
                            <h1 className="text-2xl font-bold mb-4">Tickets</h1>
                            <table className="w-full table-auto">
                                <thead>
                                <tr>
                                    <th className="px-4 py-2">Ticket ID</th>
                                    <th className="px-4 py-2">Details</th>
                                    <th className="px-4 py-2">
                                        <button onClick={sortByStatus}>
                                            Status
                                            {statusSort === 'asc' ? ' ↑' : ' ↓'}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2">
                                        <button onClick={sortByType}>
                                            Type
                                            {typeSort === 'asc' ? ' ↑' : ' ↓'}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2">
                                        <button onClick={sortByPriority}>
                                            Priority
                                            {prioritySort === 'asc' ? ' ↑' : ' ↓'}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2">Last Updated</th>
                                    <th className="px-4 py-2">Submitted Date</th>
                                    <th className="px-4 py-2">Assigned to:</th>
                                    <th className="px-4 py-2">URL</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tickets.map((ticket, index) => (
                                    <tr key={ticket.ticketId} className={rowBackgroundColors[ticket.status] || 'bg-gray-100'}>
                                        <td className="border px-4 py-2">
                                            {ticket.ticketId}
                                        </td>
                                        <td className="border px-4 py-2">{ticket.description}</td>
                                        <td className="border px-4 py-2 text-center">{formatStatus(ticket.status)}</td>
                                        <td className="border px-4 py-2 text-center">{ticket.type}</td>
                                        <td className={`border px-4 py-2 text-center font-bold ${getPriorityColor(formatPriority(ticket.priority))} ${getPriorityColorBackground(formatPriority(ticket.priority))}`}>
                                            {formatPriority(ticket.priority)}
                                        </td>
                                        <td className="border px-4 py-2 text-center">{formatTimeDifference(ticket.lastUpdatedDate)}</td>
                                        <td className="border px-4 py-2 text-center">{formatDate(ticket.submittedDate)}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {ticket.assignedTo ? (
                                                <Link to={`/user/${ticket.assignedTo.id}`} className="text-blue-600">
                                                    {`${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`}
                                                </Link>
                                            ) : null}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <Link to={`/ticket/${ticket.ticketId}`} className="text-blue-600">
                                                Ticket Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketListView;
