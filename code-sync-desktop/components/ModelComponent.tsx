import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Slider,
  Switch,
  Input,
} from "@nextui-org/react";


export default function Model({header , isOpen , setIsOpen  ,onSubmmit, title}:{
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
    onSubmmit:(name:string)=>void 
    title:string
    header:string
}) {
    const [name, setName] = useState("");

  return (
    <>
      <Modal  isOpen={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
        <ModalContent className="bg-[rgb(32,32,32)] w-72" >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-400">
                {title}
              </ModalHeader>
              <ModalBody className="bg-[rgb(32,32,32)]">
                <Input
                  type="text"
                  label="Name"
                  className="mb-3 text-[rgb(32,32,32)]"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={()=>{
                    setIsOpen(false)
                    setName("")
                    onClose();
                }}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    console.log("name", name);
                    onSubmmit(name);
                    onClose();
                  }}
                  onPress={onClose}
                >
                  {title}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}