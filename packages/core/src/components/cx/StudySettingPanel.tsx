import { defineComponent } from "vue";
import { createWorkerSetting } from "..";
import { store } from "../../script";
import { switchPlayLine } from "../../script/cx/study";
import { Tooltip } from "../Tooltip";
const settings = store.setting.cx.video;

export const StudySettingPanel = defineComponent({
    render() {
        return (
            <div class="ocs-setting-panel">
                <div class="ocs-setting-items">
                    <label>视频倍速 </label>
                    <div>
                        <Tooltip title="高倍速(大于2倍)可能导致: \n- 记录清空\n- 频繁验证码\n超星后台可以看到学习时长\n请谨慎设置❗">
                            <input
                                style={{ color: settings.playbackRate > 2 ? "red" : "" }}
                                type="number"
                                value={settings.playbackRate}
                                min="1"
                                max="16"
                                step="1"
                                onChange={(e: any) => {
                                    settings.playbackRate = e.target.valueAsNumber;
                                    if (store.currentMedia) {
                                        store.currentMedia.playbackRate = e.target.valueAsNumber;
                                    }
                                }}
                            ></input>
                        </Tooltip>
                    </div>

                    <label>播放路线</label>
                    <div>
                        <Tooltip title="如果当前视频卡顿严重，可以尝试切换路线。">
                            <select
                                id="video-line"
                                value={settings.line || ""}
                                onChange={(e: any) => {
                                    settings.line = e.target.value;
                                    if (store.videojs && store.currentMedia) {
                                        switchPlayLine(settings, store.videojs, store.currentMedia, e.target.value);
                                    }
                                }}
                            >
                                {settings.line ? (
                                    <option value={settings.line}>指定-{settings.line}</option>
                                ) : (
                                    <option value="">请指定路线(播放视频后才可选择, 无需保存)</option>
                                )}
                                {Array.from(settings.playlines || [{ label: "公网1" }, { label: "公网2" }]).map(
                                    (line: any) => (
                                        <option value={line.label}>{line.label}</option>
                                    )
                                )}
                            </select>
                        </Tooltip>
                    </div>

                    <label>静音模式</label>
                    <div>
                        <input
                            class="ocs-setting-item"
                            type="checkbox"
                            checked={settings.mute}
                            onChange={(e: any) => {
                                settings.mute = e.target.checked;
                                if (store.currentMedia) store.currentMedia.muted = e.target.checked;
                            }}
                        />
                    </div>

                    <label>复习模式</label>
                    <div>
                        <Tooltip title="遇到看过的视频,音频,ppt会重新播放，并且从第一个章节开始。">
                            <input
                                class="ocs-setting-item"
                                type="checkbox"
                                checked={settings.restudy}
                                onChange={(e: any) => {
                                    settings.restudy = e.target.checked;
                                }}
                            />
                        </Tooltip>
                    </div>
                    <hr />
                    <hr />
                    {createWorkerSetting(
                        "章节测试",
                        { selected: settings.upload },
                        (e: any) => (settings.upload = e.target.value)
                    )}

                    <label>答题间隔(秒)</label>
                    <div>
                        <input
                            type="number"
                            value={store.setting.cx.work.period}
                            min="0"
                            step="1"
                            onChange={(e: any) => {
                                store.setting.cx.work.period = e.target.valueAsNumber;
                            }}
                        />
                    </div>

                    <label>搜题请求超时时间(秒)</label>
                    <div>
                        <Tooltip title="每道题最多做n秒, 超过则跳过此题。">
                            <input
                                type="number"
                                value={store.setting.cx.work.timeout}
                                min="0"
                                step="1"
                                onChange={(e: any) => {
                                    store.setting.cx.work.timeout = e.target.valueAsNumber;
                                }}
                            />
                        </Tooltip>
                    </div>

                    <label>搜题请求重试次数</label>
                    <div>
                        <input
                            type="number"
                            value={store.setting.cx.work.retry}
                            min="0"
                            max="2"
                            step="1"
                            onChange={(e: any) => {
                                store.setting.cx.work.retry = e.target.valueAsNumber;
                            }}
                        />
                    </div>

                    <label>发生错误时暂停答题</label>
                    <div>
                        <input
                            type="checkbox"
                            checked={store.setting.cx.work.stopWhenError}
                            onChange={(e: any) => {
                                store.setting.cx.work.stopWhenError = e.target.checked;
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    },
});