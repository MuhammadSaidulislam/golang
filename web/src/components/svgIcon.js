export const SortIconSvg = ({ color }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 5.16797H2C1.72667 5.16797 1.5 4.9413 1.5 4.66797C1.5 4.39464 1.72667 4.16797 2 4.16797H14C14.2733 4.16797 14.5 4.39464 14.5 4.66797C14.5 4.9413 14.2733 5.16797 14 5.16797Z" style={{ fill: `var(${color})` }} />
            <path d="M12 8.5H4C3.72667 8.5 3.5 8.27333 3.5 8C3.5 7.72667 3.72667 7.5 4 7.5H12C12.2733 7.5 12.5 7.72667 12.5 8C12.5 8.27333 12.2733 8.5 12 8.5Z" style={{ fill: `var(${color})` }} />
            <path d="M9.33341 11.832H6.66675C6.39341 11.832 6.16675 11.6054 6.16675 11.332C6.16675 11.0587 6.39341 10.832 6.66675 10.832H9.33341C9.60675 10.832 9.83341 11.0587 9.83341 11.332C9.83341 11.6054 9.60675 11.832 9.33341 11.832Z" style={{ fill: `var(${color})` }} />
        </svg>
    );
};

export const EmptyIconSvg = ({ color }) => {
    return (
        <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.0241 50.7242C62.4336 54.4854 59.946 57.7998 56.7787 60.3775C53.6115 62.9552 49.861 64.7178 45.8551 65.5112C41.8493 66.3046 37.7101 66.1046 33.7994 64.9287C29.8887 63.7528 26.3256 61.6369 23.4216 58.7659C20.5176 55.8948 18.3611 52.3561 17.1406 48.4591C15.9202 44.5621 15.673 40.4254 16.4205 36.4108C17.1681 32.3962 18.8878 28.6258 21.4292 25.4293C23.9705 22.2328 27.2563 19.7075 30.9991 18.0742" stroke="black" style={{ stroke: `var(${color})` }} stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
            <path d="M66 41C66 37.717 65.3534 34.4661 64.097 31.4329C62.8406 28.3998 60.9991 25.6438 58.6777 23.3223C56.3562 21.0009 53.6002 19.1594 50.5671 17.903C47.5339 16.6466 44.283 16 41 16V41H66Z" stroke="black" style={{ stroke: `var(${color})` }} stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
        </svg>
    );
};


