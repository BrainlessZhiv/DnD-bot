Dice
  = count:Integer "d" sides:IntegerOrPercent modifiers:Modifier* options:Option* explosive:Explosive? " "? target:Integer? {
      return {
        type: 'dice',
        count: count,
        sides: sides,
        modifiers: modifiers,
        options: options,
        explosive: explosive,
        target: target
      };
    }

Group
  = "(" dice:Dice ")" { return dice; }

Modifier
  = op:("+" / "-" / "/" / "*") value:(Integer / Group) { return { op: op, value: value }; }

Integer
  = digits:[0-9]+ { return parseInt(digits.join(''), 10); }

IntegerOrPercent
  = Integer / "%" { return 100; }

Option
  = "k" value:Integer { return { type: 'keeph', count: value }; }
  / "kh" value:Integer { return { type: 'keeph', count: value }; }
  / "kl" value:Integer { return { type: 'keepl', count: value }; }
  / "kc" value:Integer { return { type: 'keepc', count: value }; }
  / "d" value:Integer { return { type: 'dropl', count: value}; }
  / "dl" value:Integer { return { type: 'dropl', count: value }; }
  / "dh" value:Integer { return { type: 'droph', count: value }; }
  / "dc" value:Integer { return { type: 'dropc', count: value }; }
  
Explosive
  = "!" { return true; }
  / "" { return false; }

// Parses this:     10d%+5/2*(3d10kh1dl1!)dl2 10