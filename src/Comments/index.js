import React, { useEffect, useState } from 'react';
import { formatDate } from '../UtilityMethods';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_COMMENT } from '../ServiceQueries';

const Comments = ({ commentId }) => {
    const { loading, error, data } = useQuery(GET_COMMENT, {
        variables: { commentId },
    });
    const [comment, setComment] = useState({});
    const [authorInfo, setAuthorInfo] = useState({});

    useEffect(() => {
        if (data) {
            setComment(data.getComment);
            const author = data.getComment.author;

            const authorData = author.match(/'([^']+)'/g).map((match) => match.replace(/'/g, ''));

            if (authorData.length === 4) {
                const [firstName, lastName, email, title] = authorData;

                setAuthorInfo({
                    firstName,
                    lastName,
                    email,
                    title,
                });
            }
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="comment-container">
            <div className="bg-white p-4 mb-4 rounded" key={comment.commentId}>
                <div className="flex justify-between mb-2">
                    <div className="flex flex-col">
                        <div className="text-sm font-medium">
                            {authorInfo.firstName} {authorInfo.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{authorInfo.email}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Date Posted: {formatDate(comment.timePosted)}<br />
                        Last Updated: {formatDate(comment.updatedTime)}
                    </div>
                </div>
                <div className="text-sm">{comment.content}</div>
            </div>
        </div>
    );
};

export default Comments;
