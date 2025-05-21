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
            <path d="M64.0241 50.7242C62.4336 54.4854 59.946 57.7998 56.7787 60.3775C53.6115 62.9552 49.861 64.7178 45.8551 65.5112C41.8493 66.3046 37.7101 66.1046 33.7994 64.9287C29.8887 63.7528 26.3256 61.6369 23.4216 58.7659C20.5176 55.8948 18.3611 52.3561 17.1406 48.4591C15.9202 44.5621 15.673 40.4254 16.4205 36.4108C17.1681 32.3962 18.8878 28.6258 21.4292 25.4293C23.9705 22.2328 27.2563 19.7075 30.9991 18.0742" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M66 41C66 37.717 65.3534 34.4661 64.097 31.4329C62.8406 28.3998 60.9991 25.6438 58.6777 23.3223C56.3562 21.0009 53.6002 19.1594 50.5671 17.903C47.5339 16.6466 44.283 16 41 16V41H66Z" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};


export const DashboardIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 20V14" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 20V10" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 20V4" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};


export const ChatIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M19.0714 19.0699C16.0152 22.1263 11.4898 22.7867 7.78642 21.074C7.23971 20.8539 6.79148 20.676 6.36537 20.676C5.17849 20.683 3.70117 21.8339 2.93336 21.067C2.16555 20.2991 3.31726 18.8206 3.31726 17.6266C3.31726 17.2004 3.14642 16.7602 2.92632 16.2124C1.21283 12.5096 1.87411 7.98269 4.93026 4.92721C8.8316 1.02443 15.17 1.02443 19.0714 4.9262C22.9797 8.83501 22.9727 15.1681 19.0714 19.0699Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.9394 12.4141H15.9484" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.9304 12.4141H11.9394" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.9214 12.4141H7.9304" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const TokenIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18L22 12L16 6" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 6L2 12L8 18" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

export const WalletIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6389 14.3943H17.5906C16.1042 14.3934 14.8993 13.1894 14.8984 11.703C14.8984 10.2165 16.1042 9.01263 17.5906 9.01172H21.6389" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.0486 11.6432H17.7369" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M7.74766 3H16.3911C19.2892 3 21.6388 5.34951 21.6388 8.24766V15.4247C21.6388 18.3229 19.2892 20.6724 16.3911 20.6724H7.74766C4.84951 20.6724 2.5 18.3229 2.5 15.4247V8.24766C2.5 5.34951 4.84951 3 7.74766 3Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.03561 7.53772H12.4346" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const LogsIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6V12L16 14" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const DrawingIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M21.21 7.899V16.05C21.21 19.07 19.32 21.2 16.3 21.2H7.65C4.63 21.2 2.75 19.07 2.75 16.05V7.899C2.75 4.879 4.64 2.75 7.65 2.75H16.3C19.32 2.75 21.21 4.879 21.21 7.899Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.28131 16.4303L6.80931 14.8173C7.34031 14.2543 8.22531 14.2273 8.78931 14.7573C8.80631 14.7743 9.72631 15.7093 9.72631 15.7093C10.2813 16.2743 11.1883 16.2833 11.7533 15.7293C11.7903 15.6933 14.0873 12.9073 14.0873 12.9073C14.6793 12.1883 15.7423 12.0853 16.4623 12.6783C16.5103 12.7183 18.6803 14.9453 18.6803 14.9453" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M10.3126 9.13291C10.3126 10.1019 9.5276 10.8869 8.5586 10.8869C7.5896 10.8869 6.8046 10.1019 6.8046 9.13291C6.8046 8.16391 7.5896 7.37891 8.5586 7.37891C9.5276 7.37991 10.3126 8.16391 10.3126 9.13291Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const TasksIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12H22" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const PriceIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 18H21" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 18H3.01" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 12H21" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12H3.01" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 6H21" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6H3.01" style={{ stroke: `var(${color})` }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const SettingIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.8066 7.62288L20.1842 6.54279C19.6576 5.62887 18.4907 5.31359 17.5755 5.83798V5.83798C17.1399 6.09461 16.6201 6.16742 16.1307 6.04035C15.6413 5.91329 15.2226 5.59678 14.9668 5.16064C14.8023 4.88342 14.7139 4.56766 14.7105 4.24531V4.24531C14.7254 3.72849 14.5304 3.22767 14.17 2.85694C13.8096 2.4862 13.3145 2.27713 12.7975 2.27734H11.5435C11.0369 2.27734 10.5513 2.47918 10.194 2.83821C9.83666 3.19724 9.63714 3.68386 9.63958 4.19039V4.19039C9.62457 5.23619 8.77245 6.07608 7.72654 6.07597C7.40418 6.07262 7.08843 5.98421 6.8112 5.81968V5.81968C5.89603 5.29528 4.72908 5.61056 4.20251 6.52448L3.53432 7.62288C3.00838 8.53566 3.31937 9.70187 4.22997 10.2316V10.2316C4.82187 10.5733 5.1865 11.2049 5.1865 11.8883C5.1865 12.5718 4.82187 13.2033 4.22997 13.5451V13.5451C3.32053 14.0712 3.0092 15.2346 3.53432 16.1446V16.1446L4.16589 17.2339C4.41262 17.679 4.82657 18.0076 5.31616 18.1467C5.80575 18.2859 6.33061 18.2242 6.77459 17.9753V17.9753C7.21105 17.7206 7.73116 17.6508 8.21931 17.7815C8.70746 17.9121 9.12321 18.2323 9.37413 18.6709C9.53867 18.9482 9.62708 19.2639 9.63043 19.5863V19.5863C9.63043 20.6428 10.4869 21.4993 11.5435 21.4993H12.7975C13.8505 21.4993 14.7055 20.6484 14.7105 19.5954V19.5954C14.7081 19.0873 14.9088 18.5993 15.2681 18.24C15.6274 17.8807 16.1154 17.6799 16.6236 17.6824C16.9451 17.691 17.2596 17.779 17.5389 17.9387V17.9387C18.4517 18.4646 19.6179 18.1536 20.1476 17.243V17.243L20.8066 16.1446C21.0617 15.7068 21.1317 15.1853 21.0012 14.6956C20.8706 14.206 20.5502 13.7886 20.111 13.5359V13.5359C19.6717 13.2832 19.3514 12.8658 19.2208 12.3762C19.0902 11.8866 19.1602 11.3651 19.4153 10.9272C19.5812 10.6376 19.8213 10.3975 20.111 10.2316V10.2316C21.0161 9.70216 21.3264 8.54276 20.8066 7.63203V7.63203V7.62288Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12.175" cy="11.8901" r="2.63616" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const LogoIconSvg = ({ color }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V21M12 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H12V3ZM12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H12V3Z" style={{ stroke: `var(${color})` }} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const EditIconSvg = ({ color }) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1210_168)">
                <path d="M12.75 2.25023C12.947 2.05324 13.1808 1.89699 13.4382 1.79038C13.6956 1.68378 13.9714 1.62891 14.25 1.62891C14.5286 1.62891 14.8044 1.68378 15.0618 1.79038C15.3192 1.89699 15.553 2.05324 15.75 2.25023C15.947 2.44721 16.1032 2.68106 16.2098 2.93843C16.3165 3.1958 16.3713 3.47165 16.3713 3.75023C16.3713 4.0288 16.3165 4.30465 16.2098 4.56202C16.1032 4.81939 15.947 5.05324 15.75 5.25023L5.625 15.3752L1.5 16.5002L2.625 12.3752L12.75 2.25023Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_1210_168">
                    <rect width="18" height="18" style={{ stroke: `var(${color})` }} />
                </clipPath>
            </defs>
        </svg>
    );
};


export const CommentIconSvg = ({ color }) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.3035 14.3024C12.0114 16.5948 8.61733 17.09 5.83981 15.8055C5.42978 15.6404 5.09361 15.507 4.77403 15.507C3.88387 15.5123 2.77587 16.3754 2.20002 15.8002C1.62417 15.2243 2.48795 14.1155 2.48795 13.2199C2.48795 12.9003 2.35981 12.5701 2.19474 12.1593C0.909623 9.38222 1.40558 5.98702 3.69769 3.6954C6.6237 0.768324 11.3775 0.768324 14.3035 3.69465C17.2348 6.62625 17.2295 11.3761 14.3035 14.3024Z" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.9537 9.30859H11.9604" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.9478 9.30859H8.95455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.94194 9.30859H5.94869" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};


export const LogoutIconSvg = ({ color }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3359 14.1654L17.5026 9.9987L13.3359 5.83203" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.5 10H7.5" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" style={{ stroke: `var(${color})` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
