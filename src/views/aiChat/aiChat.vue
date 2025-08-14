<template>
    <div class="aiChat">
        <div class="roomBox">
            <div :class="{ room: true, room_active: item == currentRoom }" v-for="(item, index) in roomList"
                :key="index" @click="changeRoom(item)">新的聊天
            </div>
            <el-button @click="addRoom">+创建新对话</el-button>
        </div>
        <div class="line"></div>
        <div class="chatBox">
            <div class="messageBox" ref="messageBoxRef">
                <div :class="{ itemBox: true, itemBox_reversal: item.role == 'user' }"
                    v-for="(item, index) in currentRoom.messages" :key="index">
                    <div v-if="item.content" class="content" v-html="marked.parse(item.content)"></div>
                    <div v-else-if="!item.content && isAnswer" class="loaderBox">
                        <div class="loader"></div>
                    </div>
                </div>
            </div>
            <el-input v-model="msgContent" style="width: 100%" :rows="4" type="textarea" placeholder="请输入问题" />
            <div style="display: flex;justify-content: flex-end;">
                <el-button type="primary" @click="sendMessage">发送</el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { roomType, createChat, messagesType } from "@/api/ai"
import { marked } from "marked"
import hljs from 'highlight.js';
import "highlight.js/styles/github-dark-dimmed.min.css";

const roomList = ref<roomType[]>([{
    messages: [{
        role: "system",
        content: "有什么可以帮助你的吗？"
    }]
}])
const currentRoom = ref<roomType>(roomList.value[0])
const msgContent = ref("")

function changeRoom(item: any) {
    currentRoom.value = item
}


const messageBoxRef = useTemplateRef("messageBoxRef")

const isAnswer = ref(false)

function sendMessage() {
    currentRoom.value.messages.push({
        role: "user",
        content: msgContent.value
    })
    msgContent.value = ""
    const messages = currentRoom.value.messages.filter(item => item.role != "system")


    let str = ""
    const messageData: messagesType = { role: "assistant", content: str }
    const roomIndex = roomList.value.findIndex(item => item == currentRoom.value)
    const index = currentRoom.value.messages.push(messageData)

    isAnswer.value = true
    createChat(messages, {
        onmessage(res) {
            str += res.data || "\n"
            roomList.value[roomIndex].messages[index - 1].content = str

            nextTick(() => {
                hljs.highlightAll();
                //滚动条到底部
                (messageBoxRef.value as HTMLDivElement).scrollTop = (messageBoxRef.value as HTMLDivElement).scrollHeight
            })
        },
        onclose() {
            console.log("关闭");
            isAnswer.value = false
        },
        onerror(err) {
            console.log("错误", err);
            isAnswer.value = false
            throw err
        },
    })
}


function addRoom() {
    roomList.value.push({
        messages: [{
            role: "system",
            content: "有什么可以帮助你的吗？"
        }]
    })
    currentRoom.value = roomList.value[roomList.value.length - 1]
}
</script>
<style lang="scss" scoped>
.aiChat {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: var(--box-bg-color);
    border-radius: 10px;
    display: flex;
    gap: 20px;
    box-shadow: var(--box-shadow);
    overflow: hidden;


    .roomBox {
        width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .room {
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: var(--hover-bg-color);
            }
        }

        .room_active {
            background-color: var(--color-primary);

            &:hover {
                background-color: var(--color-primary);
            }
        }
    }

    .line {
        width: 1px;
        height: 100%;
        background-color: #eee;
    }

    .chatBox {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow: hidden;

        .messageBox {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: auto;
            gap: 10px;
            padding: 20px;

            .itemBox {
                display: flex;
                align-items: center;

                .content {
                    // padding: 10px;
                    background-color: var(--el-border-color);
                    padding: 10px;
                    border-radius: 10px;

                    :deep(p) {
                        margin: 0;
                    }
                }

                .loaderBox {
                    padding: 10px 40px;
                    background-color: var(--el-border-color);
                    border-radius: 10px;

                    .loader {
                        width: 12px;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        animation: l5 1.2s infinite linear normal;
                    }

                    @keyframes l5 {
                        0% {
                            box-shadow: 20px 0 #eee, -20px 0 #409eff;
                            background: #eee
                        }

                        50% {
                            box-shadow: 20px 0 #eee, -20px 0 #eee;
                            background: #409eff
                        }

                        100% {
                            box-shadow: 20px 0 #409eff, -20px 0 #eee;
                            background: #eee
                        }
                    }
                }
            }

            .itemBox_reversal {
                justify-content: flex-end;
            }
        }

        .input {
            height: 60px;
        }
    }
}
</style>