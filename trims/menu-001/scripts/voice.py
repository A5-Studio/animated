"""Generate the TRIMS #001 narration with VoiceStudio's OmniVoice engine.

Usage (inside a venv with VoiceStudio's `omnivoice` package installed):
    python scripts/voice.py <model dir or k2-fsa/OmniVoice> [--instruct "..."] [--ref ref.wav --ref-text "..."]

1. Without --ref, a voice is designed from --instruct and saved as
   public/vo/_ref.wav, so every beat is then cloned from the same voice.
2. Each beat of src/theme.ts is spoken from TTS_TEXT below (phonetic spellings
   of foreign names) and written to public/vo/<id>.wav.
3. Clip lengths go to src/vo.json; theme.ts times the beats from it.
"""
import argparse
import json
import pathlib

import torch
from omnivoice import OmniVoice
from omnivoice.utils.audio import save_audio

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'vo'

# Spoken text per beat. Foreign names are spelled the way an Indonesian
# speaker says them, so the model pronounces them right.
TTS_TEXT = {
    'hook': 'Tiap hari pakai Klod, tapi tahu nggak, Klod itu sebenarnya siapa?',
    'shannon': 'Nama AI buatan Entropik ini diyakini sebagai penghormatan untuk seorang ilmuwan bernama Klod Syenen.',
    'bit': 'Beliau matematikawan dan insinyur elektro asal Amerika Serikat. Dia yang mempopulerkan istilah bit, nol dan satu, dan dijuluki Fader of Informesyen Tiori.',
    'turing': 'Fan fek: Syenen hidup sezaman dengan ilmuwan komputer asal Inggris yang lebih terkenal, Alen Turing.',
    'turingWork': 'Turing ini yang merumuskan konsep mesin komputer universal, dan ikut memecahkan sandi Enigma milik Jerman di Perang Dunia kedua.',
    'meet': 'Dan mereka berdua pernah ketemu, ngobrol di kantin Bel Lebs tahun seribu sembilan ratus empat puluh tiga.',
    'predict': 'Tahun seribu sembilan ratus lima puluh satu, Syenen bikin eksperimen: orang disuruh nebak huruf berikutnya dalam sebuah kalimat. Nebak yang berikutnya itu, persis cara kerja AI kayak Klod sekarang.',
    'lifespan': 'Syenen hidup cukup lama, sampai umur delapan puluh empat tahun. Beliau meninggal tahun dua ribu satu, sempat lihat internet tumbuh dari teorinya.',
    'ask': 'Kalau menurut kalian, siapa yang lebih berpengaruh di dunia AI? Alen Turing, atau Klod Syenen?',
    'outro': 'Trims udah makan siang bareng. Sampai jumpa besok!',
}
REF_TEXT = 'Halo semuanya, selamat datang di Trims, trivia singkat buat bahan obrolan makan siang di kantor.'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('model')
    ap.add_argument('--instruct', default='male, young adult, moderate pitch')
    ap.add_argument('--ref')
    ap.add_argument('--ref-text')
    ap.add_argument('--only', nargs='*', help='regenerate just these beats')
    ap.add_argument('--steps', type=int, default=32)
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    torch.manual_seed(1)
    model = OmniVoice.from_pretrained(args.model, device_map='cpu', dtype=torch.float32)
    sr = model.sampling_rate

    ref, ref_text = args.ref, args.ref_text
    if not ref:
        ref, ref_text = str(OUT / '_ref.wav'), REF_TEXT
        if not pathlib.Path(ref).exists():
            audio = model.generate(text=REF_TEXT, language='id', instruct=args.instruct, num_step=args.steps)
            save_audio(ref, audio[0], sr)
            print('designed voice ->', ref, flush=True)

    durs_path = ROOT / 'src' / 'vo.json'
    durs = json.loads(durs_path.read_text()) if durs_path.exists() else {}
    for beat, text in TTS_TEXT.items():
        if args.only and beat not in args.only:
            continue
        audio = model.generate(text=text, language='id', ref_audio=ref, ref_text=ref_text, num_step=args.steps)
        save_audio(str(OUT / f'{beat}.wav'), audio[0], sr)
        durs[beat] = round(audio[0].shape[-1] / sr, 2)
        durs_path.write_text(json.dumps(durs, indent=2) + '\n')
        print(f'{beat}: {durs[beat]}s', flush=True)


if __name__ == '__main__':
    main()
