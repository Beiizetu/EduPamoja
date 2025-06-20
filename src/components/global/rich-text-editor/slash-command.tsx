import { upload } from "@/lib/uploadcare"
import { toast } from "sonner"
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Video,
} from "lucide-react"
import { Command, createSuggestionItems, renderItems } from "novel/extensions"

export const suggestionItems = createSuggestionItems([
  {
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      window.open("/feedback", "_blank")
    },
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run()
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run()
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run()
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run()
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        // @ts-ignore
        .toggleBlockquote()
        .run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }) =>
      //@ts-ignore
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      // upload image
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0]
          try {
            if (!process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY) {
              throw new Error(
                "Uploadcare configuration missing - please set NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY",
              )
            }
            const uploaded = await upload.uploadFile(file)
            //This should return a src of the uploaded image
            const imgsrc = `https://ucarecdn.com/${uploaded.uuid}/`
            if (imgsrc) {
              editor.commands.insertContent([
                {
                  type: "image",
                  attrs: {
                    src: imgsrc,
                  },
                },
              ])
            }
          } catch (error) {
            console.error("File upload failed:", error)
            toast("File upload unavailable", {
              description: "Image uploads are currently disabled",
            })
          }
        }
      }
      input.click()
    },
  },
  {
    title: "Loom/Youtube",
    description: "Embed video",
    icon: <Video />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      const videoSrc = window.prompt("Video URL")
      if (videoSrc?.length) {
        editor.commands.insertContent([
          {
            type: "video",
            attrs: {
              src: videoSrc,
            },
          },
        ])
      }
    },
  },
])

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
})
