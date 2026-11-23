import {iteratee} from 'lodash';
import {Item} from 'rc-menu';
import React from 'react';


const response = {
    name: 'JSON Profile Report',
    includeHeaderRows: '1',
    includeLegacyCss: '1',
    includeHeaderInfo: '1',
    includeTitleRow: '1',
    categories: [0],
    legacyCssClassDefs: [
        {
            selector: 'table.pctable',
            border: 'solid 1.0pt',
            borderCollapse: 'collapse',
            fontFamily: 'Arial',
            fontSize: 'small'
        },
        {selector: 'th', border: 'solid 1.0pt'},
        {selector: 'p.cat', display: 'table-cell'},
        {selector: 'p.catIndent1', paddingLeft: '1em', display: 'table-cell'},
        {selector: 'p.catIndent2', paddingLeft: '2em', display: 'table-cell'},
        {selector: 'p.catIndent3', paddingLeft: '3em', display: 'table-cell'},
        {selector: 'p.catIndent4', paddingLeft: '4em', display: 'table-cell'},
        {selector: 'p.catIndent5', paddingLeft: '5em', display: 'table-cell'},
        {selector: 'br.page', pageBreakAfter: 'always'},
        {selector: 'hr', color: '#aca899', backgroundColor: '#aca899', height: '1px'},
        {
            selector: 'td.catHdr',
            justify: 'text-align: center;',
            fontWeight: 'bold',
            verticalAlign: 'top',
            color: '#000000',
            background: '#d7dae3',
            borderStyle: 'solid',
            borderWidth: '1.0pt',
            borderColor: '#adb7cd',
            borderBottom: '#adb7cd'
        },
        {
            selector: 'td.catSubHdr',
            justify: 'text-align: right;',
            fontWeight: 'bold',
            verticalAlign: 'top',
            color: '#000000',
            background: '#d7dae3',
            borderStyle: 'solid',
            borderWidth: '1.0pt',
            borderColor: '#adb7cd',
            borderTop: 'solid 1.0pt #adb7cd'
        },
        {
            selector: 'td.cat',
            justify: 'text-align: left;',
            verticalAlign: 'top',
            color: '#000000',
            background: '#ffffff',
            border: 'none',
            borderLeft: 'solid 1.0pt',
            borderRight: 'solid 1.0pt',
            borderColor: '#c4c4c4'
        },
        {
            selector: 'td.catAlt',
            justify: 'text-align: left;',
            verticalAlign: 'top',
            color: '#000000',
            background: '#dedede',
            border: 'none',
            borderLeft: 'solid 1.0pt',
            borderRight: 'solid 1.0pt',
            borderColor: '#c4c4c4'
        },
        {
            selector: 'td.sepcat',
            background: '#89aad0',
            borderLeft: 'solid 1.0pt',
            borderRight: 'solid 1.0pt',
            borderColor: '#c4c4c4'
        },
        {
            selector: 'td.saHdr',
            justify: 'text-align: center;',
            fontWeight: 'bold',
            verticalAlign: 'top',
            color: '#000000',
            background: '#d7dae3',
            borderStyle: 'solid',
            borderWidth: '1.0pt',
            borderColor: '#adb7cd'
        },
        {
            selector: 'td.saSubHdr',
            justify: 'text-align: right;',
            fontWeight: 'bold',
            verticalAlign: 'top',
            color: '#000000',
            background: '#d7dae3',
            borderStyle: 'solid',
            borderWidth: '1.0pt',
            borderColor: '#adb7cd'
        },
        {
            selector: 'td.sa',
            justify: 'text-align: right;',
            verticalAlign: 'top',
            color: '#000000',
            background: '#ffffff',
            border: 'none',
            whiteSpace: 'nowrap',
            paddingLeft: '1em',
            borderLeft: 'solid 1.0pt',
            borderRight: 'solid 1.0pt',
            borderColor: '#c4c4c4'
        },
        {
            selector: 'td.saAlt',
            justify: 'text-align: right;',
            verticalAlign: 'top',
            color: '#000000',
            background: '#dedede',
            border: 'none',
            whiteSpace: 'nowrap',
            paddingLeft: '1em',
            borderLeft: 'solid 1.0pt',
            borderRight: 'solid 1.0pt',
            borderColor: '#c4c4c4'
        },
        {
            selector: 'td.sepsa',
            background: '#89aad0',
            borderLeft: 'solid 1.0pt',
            borderRight: 'solid 1.0pt',
            borderColor: '#c4c4c4'
        }
    ],
    rows: [
        [
            {
                subColumns: 1,
                legacyCss: 'catHdr',
                rowId: -1,
                colId: 0,
                text: 'STI: PopStats<br/>Population Summary'
            },
            {
                subColumns: 2,
                legacyCss: 'saHdr',
                rowId: -1,
                colId: 1,
                text: '4725 15th Ave NE, Seattle WA <br/>0 - 1 mi'
            }
        ],
        [
            {legacyCss: 'catSubHdr'},
            {legacyTextAlign: 'left', legacyColor: '#000000', legacyBGColor: '#d7dae3'}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 0,
                colId: 0
            },
            {legacyCss: 'sa', legacyStyle_color: '#000000', rowId: 0, colId: 1},
            {legacyCss: 'sa', legacyStyle_color: '#000000', rowId: 0, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 1,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 1,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '51,992'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 1,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 2,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 2,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '50,021'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 2,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 3,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 3,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '47,716'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 3,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 4,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 4,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '40,320'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 4,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 5,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 5,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '35,787'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 5,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 6,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 6,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '31,354'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 6,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 7,
                colId: 0
            },
            {legacyCss: 'saalt', legacyStyle_color: '#000000', rowId: 7, colId: 1},
            {legacyCss: 'saalt', legacyStyle_color: '#000000', rowId: 7, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 8,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 8,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '3.94%'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 8,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 9,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 9,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '4.83%'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 9,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 10,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 10,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '18.34%'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 10,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 11,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 11,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '12.67%'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 11,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 12,
                colId: 0
            },
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 12, colId: 1},
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 12, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#ffffff',
                legacyBGColor: '#339900',
                rowId: 13,
                colId: 0
            },
            {
                legacyCss: 'sa',
                'legacyStyle_font-weight': 'bold',
                rowId: 13,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '47,716'
            },
            {
                legacyCss: 'sa',
                'legacyStyle_font-weight': 'bold',
                rowId: 13,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 14,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 14,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '32,355'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 14,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '68%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 15,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 15,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,045'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 15,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '2%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 16,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 16,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '10,177'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 16,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '21%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 17,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 17,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '4,139'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 17,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '9%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 18,
                colId: 0
            },
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 18, colId: 1},
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 18, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 19,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 19,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '2,438'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 19,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 20,
                colId: 0
            },
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 20, colId: 1},
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 20, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#ffffff',
                legacyBGColor: '#339900',
                rowId: 21,
                colId: 0
            },
            {
                legacyCss: 'sa',
                'legacyStyle_font-weight': 'bold',
                rowId: 21,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '47,716'
            },
            {
                legacyCss: 'sa',
                'legacyStyle_font-weight': 'bold',
                rowId: 21,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 22,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 22,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '2,849'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 22,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '6%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 23,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 23,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '3,539'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 23,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '7%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 24,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 24,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '789'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 24,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '2%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 25,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 25,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '16,762'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 25,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '35%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 26,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 26,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '2,252'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 26,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '5%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 27,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 27,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,074'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 27,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '2%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 28,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 28,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '4,919'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 28,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '10%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 29,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 29,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '4,102'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 29,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '9%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 30,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 30,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '2,596'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 30,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '5%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 31,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 31,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,984'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 31,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '4%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 32,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 32,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,594'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 32,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '3%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 33,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 33,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,224'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 33,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '3%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 34,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 34,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,076'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 34,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '2%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 35,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 35,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,132'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 35,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '2%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 36,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 36,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '866'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 36,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '2%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 37,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 37,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '508'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 37,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '1%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 38,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 38,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '225'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 38,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '0%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 39,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 39,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '223'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 39,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '0%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 40,
                colId: 0
            },
            {legacyCss: 'sa', legacyStyle_color: '#000000', rowId: 40, colId: 1},
            {legacyCss: 'sa', legacyStyle_color: '#000000', rowId: 40, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 41,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 41,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '22.0'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 41,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 42,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 42,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '29.9'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 42,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 43,
                colId: 0
            },
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 43, colId: 1},
            {legacyCss: 'sepsa', legacyStyle_color: '#000000', rowId: 43, colId: 1}
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#ffffff',
                legacyBGColor: '#339900',
                rowId: 44,
                colId: 0
            },
            {
                legacyCss: 'sa',
                'legacyStyle_font-weight': 'bold',
                rowId: 44,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '21,525'
            },
            {
                legacyCss: 'sa',
                'legacyStyle_font-weight': 'bold',
                rowId: 44,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '&nbsp;'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 45,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 45,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '264'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 45,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '1%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 46,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 46,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '279'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 46,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '1%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 47,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 47,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,036'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 47,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '5%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 48,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 48,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '3,131'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 48,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '15%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 49,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 49,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,151'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 49,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '5%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 50,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 50,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '8,299'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 50,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '39%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 51,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 51,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '4,495'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 51,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '21%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#ffffff',
                rowId: 52,
                colId: 0
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 52,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,143'
            },
            {
                legacyCss: 'sa',
                legacyStyle_color: '#000000',
                rowId: 52,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '5%'
            }
        ],
        [
            {
                legacyTextAlign: 'left',
                legacyColor: '#000000',
                legacyBGColor: '#dedede',
                rowId: 53,
                colId: 0
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 53,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'main'},
                value: '1,726'
            },
            {
                legacyCss: 'saalt',
                legacyStyle_color: '#000000',
                rowId: 53,
                colId: 1,
                legAttribs: {categoryCol: 0, part: 'percent'},
                value: '8%'
            }
        ]
    ]
}
const ProfileTable = ({profile}) => {
    console.log("response.rows :",response.rows[0][0].rowId);
    return (
        <table className="pctable" width="100%" rules="groups" valign="top">
            <thead>
            <tr>
                <td colSpan="1" className={response.rows[0][0].legacyCss} rowid={response.rows[0][0].rowId}
                    colid={response.rows[0][0].colId}>{response.rows[0][0].text}</td>
                <td colSpan="2" className={response.rows[0][1].legacyCss} rowid={response.rows[0][1].rowId}
                    colid={response.rows[0][1].colId}>{response.rows[0][1].text}</td>
            </tr>
            </thead>
            <tbody>
            {
                response.rows.slice(1).map((row,index) => {
                    return (
                        <tr key={index} >
                            {
                                row.map((item, index) => <td key={index} className={item.legacyCss} rowid={item.rowId}
                                                             colid={item.colId}> {item.text} </td>)
                            }
                        </tr>
                    )

                })
            }
            </tbody>
        </table>
    )

}

export default ProfileTable;
