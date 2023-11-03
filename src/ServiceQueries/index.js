import { gql } from '@apollo/client';

// Type: Comment
export const GET_COMMENT = gql`
    query GetComment($commentId: ID!) {
        getComment(commentId: $commentId) {
            commentId
            timePosted
            content
            author
            updatedTime
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($commentId: ID!, $content: String) {
        updateComment(commentId: $commentId, content: $content) {
            commentId
            timePosted
            content
            author
            ticket {
                ticketId
            }
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($commentId: ID!) {
        deleteComment(commentId: $commentId)
    }
`;

// Type: Ticket
export const GET_TICKET = gql`
    query GetTicket($ticketId: ID!) {
        getTicket(ticketId: $ticketId) {
            ticketId
            status
            details
            submittedDate
            lastUpdatedDate
            priority
            source
            assignedTo {
                id
                firstName
                lastName
            }
            comments {
                commentId
            }
            description
        }
    }
`;

export const GET_ALL_TICKETS = gql`
    query GetAllTickets {
        getAllTickets {
            ticketId
            status
            details
            submittedDate
            lastUpdatedDate
            priority
            source
            assignedTo {
                id
                firstName
                lastName
            }
            description
        }
    }
`;

export const CREATE_TICKET = gql`
    mutation CreateTicket($status: StatusEnum!, $details: String!, $priority: PriorityEnum!, $source: SourceEnum!, $assignedTo: ID, $ticketType: TypeEnum!, $description: String!) {
        createTicket(status: $status, details: $details, priority: $priority, source: $source, assignedTo: $assignedTo, ticketType: $ticketType, description: $description) {
            ticketId
        }
    }
`;


// Type: User
export const GET_USER = gql`
    query GetUser($userId: ID!) {
        getUser(userId: $userId) {
            id
            firstName
            lastName
            title
            numOfTickets
            numOfOpenTickets
            numOfClosedTickets
            assignedTickets {
                ticketId
            }
        }
    }
`;

// Get all users
export const GET_ALL_USERS = gql`
    query GetAllUsers {
        getAllUsers {
            id
            firstName
            lastName
            title
            numOfTickets
            numOfOpenTickets
            numOfClosedTickets
            assignedTickets {
                ticketId
            }
        }
    }
`;

// Create a new user
export const CREATE_USER = gql`
    mutation CreateUser($firstName: String!, $lastName: String!, $title: String, $email: String!) {
        createUser(firstName: $firstName, lastName: $lastName, title: $title, email: $email) {
            id
            firstName
            lastName
            title
            numOfTickets
            numOfOpenTickets
            numOfClosedTickets
        }
    }
`;

// Update an existing user
export const UPDATE_USER = gql`
    mutation UpdateUser($userId: ID!, $firstName: String, $lastName: String, $title: String, $email: String) {
        updateUser(userId: $userId, firstName: $firstName, lastName: $lastName, title: $title, email: $email) {
            id
            firstName
            lastName
            title
            numOfTickets
            numOfOpenTickets
            numOfClosedTickets
        }
    }
`;

// Delete a user
export const DELETE_USER = gql`
    mutation DeleteUser($userId: ID!) {
        deleteUser(userId: $userId)
    }
`;

// Associate a ticket with a user
export const ASSOCIATE_TICKET_WITH_USER = gql`
    mutation AssociateTicketWithUser($userId: ID!, $ticketId: ID!) {
        associateTicketWithUser(userId: $userId, ticketId: $ticketId) {
            id
            assignedTickets {
                ticketId
            }
        }
    }
`;

// Dissociate a ticket from a user
export const DISSOCIATE_TICKET_FROM_USER = gql`
    mutation DissociateTicketFromUser($userId: ID!, $ticketId: ID!) {
        dissociateTicketFromUser(userId: $userId, ticketId: $ticketId) {
            id
            assignedTickets {
                ticketId
            }
        }
    }
`;


