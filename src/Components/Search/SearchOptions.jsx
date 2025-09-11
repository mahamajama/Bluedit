

export default function SearchOptions({ options, onChangeOptions }) {
    const types = ['posts', 'communities', 'comments', 'media', 'people'];
    function capitalizeFirstLetter(string) {
        return String(string).charAt(0).toUpperCase() + String(string).slice(1);
    }

    return (
        <div>
            <p>
                Type:
                {types.map(typeName => {
                    return (
                        <label key={typeName}>
                            <input 
                                type="radio"
                                name="searchType"
                                value={typeName}
                                checked={options.type === typeName}
                                className="searchTypeRadio"
                                onChange={(e) => onChangeOptions({...options, type: e.target.value})}
                            />
                            {capitalizeFirstLetter(typeName)}
                        </label>
                    );
                })}
            </p>
            <label>
                Sort by:
                <select
                    name="sortBy"
                    value={options.sort}
                    onChange={(e) => onChangeOptions({...options, sort: e.target.value})}
                >
                    <option value="relevance">Relevance</option>
                    <option value="top">Top</option>
                    <option value="new">New</option>
                    <option value="comments">Comments</option>
                </select>
            </label>
            <label>
                Links from:
                <select 
                    name="linksFrom"
                    value={options.t}
                    onChange={(e) => onChangeOptions({...options, t: e.target.value})}
                >
                    <option value="all">All time</option>
                    <option value="day">24 hours</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                    <option value="year">Past year</option>
                </select>
            </label>
            <label>
                SafeSearch:
                <input 
                    type="checkbox" 
                    name="safeSearch"
                    value={!options.includeOver18}
                    onChange={(e) => onChangeOptions({...options, includeOver18: !e.target.value})}
                    className="safeSearch"
                />
            </label>
        </div>
    );
}