import { useState } from "react"


export const JsonInput = (props: any) => {

    const [inputText, setInputText] = useState(`{
        "user":{ 
           "name": "Pritesh",
           "age": 25,
           "address" : {
                "city": "Mumbai",
                "Area" : "Navi Mumbai"
           }
        },
        "items":[{"name": "ipad","price":"600"},{"name": "Mobile","price":"500"}]
        }`);
    const [error, setError] = useState<string>("");

    const handleVisulize = () => {
        try {
            const parsedJson = JSON.parse(inputText);
            props?.onVisulize(parsedJson);
            setError("")
        } catch (e) {
            setError("Invalid JSON")
        }
    }

    return (
        <div className="w-full max-w-3xl mb-6">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={30}
                className="w-full border border--gray-300 p-2 rounded"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
                onClick={() => handleVisulize()}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >Visulize</button>
        </div>
    )
}

export default JsonInput