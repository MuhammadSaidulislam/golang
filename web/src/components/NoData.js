import React from 'react';
import { IconPlus } from '@douyinfe/semi-icons';
import { EmptyIconSvg } from './svgIcon';

const NoData = ({ description, btnFunction }) => {
    return (
        <div className='empty'>

            <EmptyIconSvg color="--semi-table-thead-0" />
            <h6>No Data Yet?</h6>
            <p dangerouslySetInnerHTML={{ __html: description }}></p>
            {btnFunction ? <button className='emptyBtn' onClick={btnFunction}><IconPlus />New Token</button> : ""}
        </div>
    )
}

export default NoData