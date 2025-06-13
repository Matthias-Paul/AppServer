import { BsCircleFill } from 'react-icons/bs'
import { useState, useEffect, useMemo, useRef } from 'react'
import QRCode from 'react-qr-code'
import getBackendURL from '../components/GetBackendURL.jsx'
import toast from 'react-hot-toast'

const NetworkManagement = () => {
  const backendIp = import.meta.env.VITE_BACKEND_IP
  const backendPort = import.meta.env.VITE_BACKEND_PORT
  const backendSSID = import.meta.env.VITE_NETWORK_NAME
  const [serverIp, setServerIp] = useState(backendIp)
  const [serverPort, setServerPort] = useState(backendPort)
  const [ssid, setSsid] = useState(backendSSID)
  const [churchName, setChurchName] = useState('St Michael')// this should  come from  redux  state

  const [password, setPassword] = useState('')

  const qrRef = useRef(null)

  const downloadQR = () => {
    const svg = qrRef.current
    const serializer = new XMLSerializer()
    const svgData = serializer.serializeToString(svg)
    const canvas = document.createElement('canvas')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.href = pngFile
      downloadLink.download = 'qr-code.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const printQR = () => {
    const svg = qrRef.current
    const serializer = new XMLSerializer()
    const svgData = serializer.serializeToString(svg)
    const newWindow = window.open('', '_blank')
    newWindow.document.write(`
      <html>
        <head>
          <title>Print QR</title>
        </head>
        <body style="text-align: center; padding-top: 50px;">
          ${svgData}
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `)
    newWindow.document.close()
  }

  const handleGenerateQRCode = () => {
    if (!serverIp || !serverPort || !ssid || !password || !churchName) {
      toast.error('All fields are required!')
      return
    }
    setServerIp(serverIp)
    setServerPort(serverPort)
    setSsid(ssid)
    setPassword(password)
    setChurchName(churchName)
    toast.success('QR Code generated successfully!')
  }
  const qrValue = useMemo(() => {
    return JSON.stringify({
      server_ip: serverIp,
      server_port: serverPort,
      SSID: ssid,
      password: password,
      churchName:churchName
    })
  }, [serverIp, serverPort, ssid, password, churchName])

  console.log(qrValue)

  return (
    <>
      <div className="pt-7 min-h-[400px] w-full pl-7 overflow-hidden ">
        <div className="flex justify-between items-center  ">
          <h2 className=" text-[#0D47A1]  font-bold text-3xl  xl:text-4xl  ">
            NETWORK & CONNECTIVITY
          </h2>
          <button
            onClick={handleGenerateQRCode}
            className="bg-[#0D47A1]  text-[#E3F2FD] text-md xl:text-xl  cursor-pointer py-2 px-6 rounded-lg text-center  "
          >
            Generate QR Code
          </button>
        </div>
        <div className=" mt-8 grid grid-cols-2  gap-x-6 text-[#0D47A1]">
          <div className="border rounded-xl flex flex-col items-start px-4 lg:px-8  justify-start border-[#0D47A1]   w-full ">
            <h2 className="my-4 font-bold text-[25px] "> Server Connection Details </h2>
            <div className="flex items-center justify-start font-semibold w-full mb-4 bg-[#F8F9FA] border border-[#E1E7F1] px-5 py-2 text-[20px] rounded">
              <BsCircleFill className="text-[#0D47A1] mr-2  w-5 h-5" /> Server Running - PORT{' '}
              {`${import.meta.env.VITE_BACKEND_PORT} `}
            </div>
            <h2 className=" font-bold text-[20px] "> Server IP Address </h2>
            <input
              onChange={(e) => setServerIp(e.target.value)}
              value={serverIp}
              type="text"
              className="flex focus:outline-none items-center mt-1 font-semibold mb-4 w-full border border-[#E1E7F1] px-5 py-2 text-[20px] rounded justify-start"
            />
            <h2 className=" font-bold text-[20px] "> PORT </h2>
            <input
              value={serverPort}
              type="text"
              onChange={(e) => setServerPort(e.target.value)}
              className="flex items-center focus:outline-none mt-1 font-semibold mb-4 w-full border border-[#E1E7F1] px-5 py-2 text-[20px] rounded justify-start"
            />
            <h2 className=" font-bold text-[20px] "> WIFI Network </h2>
            <input
              value={ssid}
              type="text"
              onChange={(e) => setSsid(e.target.value)}
              className="flex items-center focus:outline-none mt-1 font-semibold mb-4 w-full border border-[#E1E7F1] px-5 py-2 text-[20px] rounded justify-start"
            />
            <h2 className=" font-bold text-[20px] "> WIFI Password </h2>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="flex items-center focus:outline-none mt-1 font-semibold mb-4 w-full border border-[#E1E7F1] px-5 py-2 text-[20px] rounded justify-start"
            />
          </div>
          <div className="border rounded-xl px-4 lg:px-8 flex pb-5 flex-col items-center justify-start border-[#0D47A1]  w-full ">
            <h2 className="mt-4  font-bold text-center text-[25px] mb-5">
              {' '}
              QR Code For Clients Connection{' '}
            </h2>
            <div className="border mx-2 rounded-lg p-8 bg-white">
              <QRCode ref={qrRef} fgColor="#0D47A1" size={200} value={qrValue} />
              <h2 className="text-center font-bold text-[20px] mt-[10px]"> QR Code</h2>
            </div>
            <p className="my-7 font-semibold ">Scan this code with the mobile app to connect</p>
            <div className="flex items-center gap-x-5 w-full justify-between">
              <button
                onClick={downloadQR}
                className=" active:text-[#0D47A1] active:bg-[#E3F2FD]  bg-[#0D47A1]  text-[#E3F2FD] text-lg xl:text-xl cursor-pointer py-2 px-4 rounded-lg text-center"
              >
                Download QR
              </button>
              <button
                onClick={printQR}
                className="active:text-[#0D47A1] active:bg-[#E3F2FD]  bg-[#0D47A1]  text-[#E3F2FD] text-lg xl:text-xl cursor-pointer py-2 px-4 rounded-lg text-center"
              >
                Print QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NetworkManagement
