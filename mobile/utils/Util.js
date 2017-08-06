import moment from 'moment';
import humanizeDuration from 'humanize-duration'

const humanizeDiff = diff => humanizeDuration(moment.duration(diff), {
    largest: 2,
    delimiter: ' e ',
    language: 'pt'
});

export { humanizeDiff };