import SortDropdown from "./SortDropdown";

export default function TimeDropdown() {

    const options = {
        'All Time': 'all',
        '24 Hours': 'day',
        'Past Week': 'week',
        'Past Month': 'month',
        'Past Year': 'year',
    }

    return (
        <SortDropdown param='t' options={options} />
    );
}