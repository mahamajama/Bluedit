
export default function getRandomSampleOfType(type) {
    switch (type) {
        case 'subreddit':
            return getRandomSubredditSample();
        case 'comments':
            return getRandomCommentsSample();
        case 'search':
            return getRandomSearchSample();
        case 'subredditSearch':
            return getRandomSubredditSearchSample();
        case 'user':
            return getRandomUserSample();
        default:
            console.log(`Couldn't find samples of type: ${type}.`);
            break;
    }
}

export function getRandomSampleFromList(arr) {
    const x = Math.floor(Math.random() * arr.length);
    return arr[x];
}

export const subredditSamples = [
    'subredditSample_house.json',
    'subredditSample_funk.json',
    'subredditSample_hiphopheads.json',
    'subredditSample_jungle.json',
    'subredditSample_kpop.json',
    'subredditSample_punk.json',
    'subredditSample_shoegaze.json',
    'subredditSample_techno.json'
];
export const getRandomSubredditSample = () => {
    return getRandomSampleFromList(subredditSamples);
}

export const commentsSamples = [
    'commentsSample_external.json',
    'commentsSample_self.json',
    'commentsSample_external_hiphopheads.json',
    'commentsSample_external_hiphopheads2.json',
    'commentsSample_image_kpop.json',
    'commentsSample_self_jungle.json',
    'commentsSample_self_shoegaze.json',
    'commentsSample_self_movies.json'
];
export const getRandomCommentsSample = () => {
    return getRandomSampleFromList(commentsSamples);
}

export const searchSamples = [
    'searchSample_house.json',
    'searchSample_hiphop.json',
    'searchSample_shoegaze.json',
    'searchSample_punk.json',
    'searchSample_funk.json',
    'searchSample_techno.json',
    'searchSample_kpop.json'
];
export const getRandomSearchSample = () => {
    return getRandomSampleFromList(searchSamples);
}

export const subredditSearchSamples = [
    'searchSample_subreddits_house.json',
    'searchSample_subreddits_hiphop.json',
    'searchSample_subreddits_shoegaze.json',
    'searchSample_subreddits_punk.json',
    'searchSample_subreddits_funk.json',
    'searchSample_subreddits_techno.json',
    'searchSample_subreddits_kpop.json'
];
export const getRandomSubredditSearchSample = () => {
    return getRandomSampleFromList(subredditSearchSamples);
}

export const userSamples = [
    'searchSample_subreddits_house.json',
    'searchSample_subreddits_hiphop.json',
    'searchSample_subreddits_shoegaze.json',
    'searchSample_subreddits_punk.json',
    'searchSample_subreddits_funk.json',
    'searchSample_subreddits_techno.json',
    'searchSample_subreddits_kpop.json'
];
export const getRandomUserSample = () => {
    return getRandomSampleFromList(subredditSearchSamples);
}



