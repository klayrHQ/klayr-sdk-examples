import { cryptography } from 'lisk-sdk';
import { PostProps, PostPropsJSON } from './types';

export const stringifyPost = (post: PostProps): PostPropsJSON => ({
	author: cryptography.address.getLisk32AddressFromAddress(post.author),
	content: post.content,
	date: post.date,
	id: post.id,
	likes: post.likes.map(l => cryptography.address.getLisk32AddressFromAddress(l)),
	replies: post.replies.map(r => ({
		...r,
		author: cryptography.address.getLisk32AddressFromAddress(r.author),
	})),
	reposts: post.reposts.map(p => cryptography.address.getLisk32AddressFromAddress(p)),
});
