import { FaPython } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { FaJs } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { FaAngular } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { FaPhp } from "react-icons/fa";
import { FaDocker } from "react-icons/fa";
import { DiRuby } from "react-icons/di";
import { FaDatabase } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaFileArchive } from "react-icons/fa";
import { FaFileCode } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { FaFilePowerpoint } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaFileAudio } from "react-icons/fa";
import { FaFileCsv } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { FaRust } from "react-icons/fa";
import { FaSwift } from "react-icons/fa";
import { SiKotlin } from "react-icons/si";
import { SiCplusplus } from "react-icons/si";
import { SiCsharp } from "react-icons/si";
import { FaTerminal } from "react-icons/fa";
import { FaRProject } from "react-icons/fa";
import { SiPerl } from "react-icons/si";
import { SiGo } from "react-icons/si";

const FileIcon = ({ file, isdir }: { file: string; isdir: boolean }) => {
  if (isdir) return <FaFolder className="text-blue-500" />;
  const ex = file.split(".").pop();
  switch (ex) {
    case "py":
      return <FaPython className="text-blue-500" />;
    case "js":
      return <FaJs className="text-yellow-400" />;
    case "java":
      return <FaJava className="text-red-600" />;
    case "html":
      return <FaHtml5 className="text-red-600" />;
    case "css":
      return <FaCss3 className="text-blue-500" />;
    case "jsx":
      return <FaReact className="text-blue-500" />;
    case "tsx":
      return <FaReact className="text-blue-500" />;
    case "vue":
      return <FaVuejs className="text-green-500" />;
    case "ts":
      return <SiTypescript className="text-blue-500" />;
    case "angular":
      return <FaAngular className="text-red-600" />;
    case "php":
      return <FaPhp className="text-blue-500" />;
    case "rb":
      return <DiRuby className="text-red-600" />;
    case "dockerfile":
      return <FaDocker className="text-blue-500" />;
    case "json":
      return <VscJson className="text-blue-500" />;
    case "sql":
      return <FaDatabase className="text-blue-500" />;
    case "csv":
      return <FaFileCsv className="text-blue-500" />;
    case "pdf":
      return <FaFilePdf className="text-red-600" />;
    case "doc":
      return <FaFileWord className="text-blue-500" />;
    case "docx":
      return <FaFileWord className="text-blue-500" />;
    case "ppt":
      return <FaFilePowerpoint className="text-red-600" />;
    case "pptx":
      return <FaFilePowerpoint className="text-red-600" />;
    case "xls":
      return <FaFileExcel className="text-green-500" />;
    case "xlsx":
      return <FaFileExcel className="text-green-500" />;
    case "png":
      return <FaFileImage className="text-blue-500" />;
    case "jpg":
      return <FaFileImage className="text-blue-500" />;
    case "jpeg":
      return <FaFileImage className="text-blue-500" />;
    case "gif":
      return <FaFileImage className="text-blue-500" />;
    case "mp4":
      return <FaFileVideo className="text-red-600" />;
    case "mkv":
      return <FaFileVideo className="text-red-600" />;
    case "avi":
      return <FaFileVideo className="text-red-600" />;
    case "mp3":
      return <FaFileAudio className="text-green-500" />;
    case "wav":
      return <FaFileAudio className="text-green-500" />;
    case "ogg":
      return <FaFileAudio className="text-green-500" />;
    case "zip":
      return <FaFileArchive className="text-red-600" />;
    case "rar":
      return <FaFileArchive className="text-red-600" />;
    case "tar":
      return <FaFileArchive className="text-red-600" />;
    case "gz":
      return <FaFileArchive className="text-red-600" />;
    case "bz":
      return <FaFileArchive className="text-red-600" />;
    case "7z":
      return <FaFileArchive className="text-red-600" />;
    case "tgz":
      return <FaFileArchive className="text-red-600" />;
    case "txt":
      return <FaFile className="text-gray-400" />;
    case "md":
      return <FaFileCode className="text-blue-500" />;
    case "rs":
      return <FaRust className="text-red-600" />;
    case "swift":
      return <FaSwift className="text-orange-500" />;
    case "kt":
      return <SiKotlin className="text-purple-500" />;
    case "cpp":
      return <SiCplusplus className="text-blue-500" />;
    case "cs":
      return <SiCsharp className="text-purple-500" />;
    case "sh":
      return <FaTerminal className="text-green-500" />;
    case "r":
      return <FaRProject className="text-blue-500" />;
    case "pl":
      return <SiPerl className="text-blue-500" />;
    case "go":
      return <SiGo className="text-blue-500" />;
    default:
      return <FaFileAlt className="text-gray-400" />;
  }
};

export default FileIcon;
