

// import React from 'react';

// export default function TestComponent() {
//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-3  grid-flow-col gap-4">
//         {/* First item - one column width, stacked vertically */}
//         <div className="bg-green-500 p-4 text-white">
//           Second Item (1 column width)
//         </div>

//         {/* Second item - one column width, stacked vertically */}
//         <div className="bg-red-500 p-4 text-white">
//           Third Item (1 column width)
//         </div>

//         {/* Third item - spans 2 columns */}
//         <div className="bg-blue-500 p-4 text-white col-span-2 row-span-2">
//           First Item (Spans 2 columns)
//         </div>

        
//       </div>


//       <div className="grid grid-cols-3 gap-4 mt-4">
//         {/* First item - spans 2 columns */}
//         <div className="bg-blue-500 p-4 text-white col-span-2 row-span-2">
//           First Item (Spans 2 columns)
//         </div>

//         {/* Second item - one column width, stacked vertically */}
//         <div className="bg-green-500 p-4 text-white">
//           Second Item (1 column width)
//         </div>

//         {/* Third item - one column width, stacked vertically */}
//         <div className="bg-red-500 p-4 text-white">
//           Third Item (1 column width)
//         </div>

       
//       </div>
      
//     </div>
//   );
// }


import React from 'react';

export default function TestComponent() {
  return (
    <div className="container mx-auto p-4">
      {/* Single Grid Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* First item - 1 column width */}
        <div className="bg-green-500 p-4 text-white">
          Second Item (1 column width)
        </div>

        {/* Second item - 1 column width */}
        <div className="bg-red-500 p-4 text-white">
          Third Item (1 column width)
        </div>

        {/* Third item - spans 2 columns and 2 rows */}
        <div className="bg-blue-500 p-4 text-white col-span-2 row-span-2">
          First Item (Spans 2 columns, 2 rows)
        </div>

        {/* First item - spans 2 columns and 2 rows (Second row) */}
        <div className="bg-blue-500 p-4 text-white col-span-2 row-span-2">
          First Item (Spans 2 columns, 2 rows)
        </div>

        {/* Second item - 1 column width (Second row) */}
        <div className="bg-green-500 p-4 text-white">
          Second Item (1 column width)
        </div>

        {/* Third item - 1 column width (Second row) */}
        <div className="bg-red-500 p-4 text-white">
          Third Item (1 column width)
        </div>
      </div>
    </div>
  );
}
