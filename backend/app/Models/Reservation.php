<?php

namespace App\Models; // ← app/Models 配下なら: namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    // 一括代入を許可するカラム
    protected $fillable = [
        'date','program','slot','room','name','contact','note','status','start_at','end_at',
        'last_name','first_name','email','phone','notebook_type','has_certificate',
    ];

    // 便利キャスト（任意）
    protected $casts = [
         // 画面都合で "YYYY-MM-DD" が欲しければ 'date:Y-m-d' でもOK
        'date'     => 'date',
        'start_at' => 'immutable_datetime',
        'end_at'   => 'immutable_datetime',
        // DBカラムが string でも、取り出し時は boolean に寄せたい
        'has_certificate' => 'boolean',
    ];

    /**
     * DBカラムが string('0' / '1' など)でも安全に保存できるようにする保険
     * -true系: true, 1, "1", "true", "yes", "y"
     * -faluse系: false, 0, "0", "false", "no", "n"
     */
    public function setHasCertificateAttribute($value): void
    {
        $this->attributes['has_certificate'] =
            filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0'; //カラムが string のため文字で保存
    }
    /**
     * name を自動保管したい場合(任意)
     * 保存時に name が空なら 姓+名から組み立てる     
     */
    protected static function booted(): void
    {
        static::saving(function (self $m){
                if(empty($m->name)) {
                    $m->name = trim(($m->last_name ?? ''). '' .($m->first_name ?? ''));
                }
            });
    }
}
