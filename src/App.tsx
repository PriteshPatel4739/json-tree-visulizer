import { useState } from 'react'

import './App.css'
import JsonInput from './components/JsonInput'
import { TreeVisulizer } from './components/TreeVisulizer';
import SearchBar from './components/SearchBar';


function App() {
  const [jsondata, setJsondata] = useState<any>(null);
  const [searchPath, setSearchPath] = useState<any>("");

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center p-4'>
      <h1 className='text-3xl font-bold mb-4'>JSON Tree Visulizer</h1>

      <JsonInput
         onVisulize = {(data:any)=>setJsondata(data)}
      />
      {jsondata && (
        <>
           <SearchBar onSearch={setSearchPath}></SearchBar>
           <TreeVisulizer data = {jsondata} searchPath = {searchPath}/>
        </>
      )}
    </div>
  )
}

export default App
